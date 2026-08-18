import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Company, CompanyDocument } from './schemas/company.schema';

import { Model } from 'mongoose';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

import { User, UserDocument, UserRole } from '../user/schemas/user.schema';

import {
  CompanyCounter,
  CompanyCounterDocument,
} from './schemas/counter.schema';

import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { CompanyCreatedEvent } from './events/company-created.event';
import { CompanyUpdatedEvent } from './events/company-updated.event';

@Injectable()
export class CompanyService {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,

    @InjectModel(CompanyCounter.name)
    private counterModel: Model<CompanyCounterDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getNextCompanyId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'companyId' },
      { $inc: { seq: 1 } },

      {
        returnDocument: 'after',
        upsert: true,
      },
    );

    return counter.seq;
  }

  // ---------------------------------------------------------
  // Create Company
  // ---------------------------------------------------------

  async create(dto: CreateCompanyDto) {
    const nextCompanyId = await this.getNextCompanyId();

    const exists = await this.companyModel.findOne({
      $or: [
        {
          companyId: dto.companyId,
        },
        {
          email: dto.email,
        },
        {
          commercialRegistration: dto.commercialRegistration,
        },
      ],
      isDeleted: false,
    });

    if (exists) {
      throw new ConflictException('Company already exists.');
    }

    const createdCompany = await this.companyModel.create({
      ...dto,
      companyId: `COMP-${nextCompanyId.toString()}`,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(
      // "123123",
      dto.password,
      10,
    );

    const createdUser = await this.userModel.create({
      companyId: createdCompany._id.toString(),
      firstName: dto.managerFirstName,
      lastName: dto.managerLastName,
      username: dto.email,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: false,
    });

    await createdUser.save();

    const html = `
    <p>Hello</p>
    <p>Your account created Successfully this is your id ${createdCompany._id.toString()}</p>
    <p> Activate you account by click here <a href=http://localhost:3000/complete-registration/${createdUser._id.toString()}> </a></p>
  `;

    await this.emailService.sendToHrManager(
      createdCompany.email,
      `Your Account Created Successfully`,
      html,
    );

    this.eventEmitter.emit(
      'company.created',
      new CompanyCreatedEvent(createdCompany),
    );

    return createdCompany;
  }

  // ---------------------------------------------------------
  // Get All
  // ---------------------------------------------------------

  async findAll() {
    return this.companyModel
      .find({
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------

  async search(query: SearchCompanyDto) {
    const {
      search,
      companyId,
      companyName,
      companyNameArabic,
      industry,
      country,
      city,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
    };

    if (search?.trim()) {
      const keyword = this.escapeRegex(search.trim());

      filter.$or = [
        {
          companyId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          companyName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          companyNameArabic: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          legalName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          industry: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          city: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          country: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (companyId) filter.companyId = companyId;

    if (companyName?.trim()) {
      filter.companyName = {
        $regex: this.escapeRegex(companyName.trim()),
        $options: 'i',
      };
    }


    if (companyNameArabic?.trim()) {
      filter.companyNameArabic = {
        $regex: this.escapeRegex(companyNameArabic.trim()),
        $options: 'i',
      };
    }

    if (industry?.trim()) {
      filter.industry = {
        $regex: this.escapeRegex(industry.trim()),
        $options: 'i',
      };
    }

    if (country?.trim()) {
      filter.country = {
        $regex: this.escapeRegex(country.trim()),
        $options: 'i',
      };
    }

    if (city?.trim()) {
      filter.city = {
        $regex: this.escapeRegex(city.trim()),
        $options: 'i',
      };
    }

    if (status?.trim()) {
      filter.status = status.trim().toUpperCase();
    }

    const data = await this.companyModel
      .find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.companyModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ---------------------------------------------------------
  // Find One
  // ---------------------------------------------------------

  async findOne(id: string) {
    const company = await this.companyModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  // ---------------------------------------------------------
  // Update
  // ---------------------------------------------------------

  async update(id: string, dto: UpdateCompanyDto) {

    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      dto,
      {
        returnDocument: 'after',
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    this.eventEmitter.emit('company.updated', new CompanyUpdatedEvent(company));

    return company;
  }

  // ---------------------------------------------------------
  // Change Status
  // ---------------------------------------------------------

  async changeStatus(id: string, dto: UpdateCompanyDto) {

    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      dto,
      {
        returnDocument: 'after',
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    this.eventEmitter.emit('company.updated', new CompanyUpdatedEvent(company));

    return company;
  }

  // ---------------------------------------------------------
  // Update Logo
  // ---------------------------------------------------------

  async updateLogo(id: string, dto: UpdateCompanyDto) {


    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      dto,
      {
        returnDocument: 'after',
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }


    this.eventEmitter.emit('company.updated', new CompanyUpdatedEvent(company));

    return company;
  }

  // ---------------------------------------------------------
  // Soft Delete
  // ---------------------------------------------------------

  async remove(id: string) {
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return {
      message: 'Company deleted successfully.',
    };
  }

  // ---------------------------------------------------------
  // Escape Regex
  // ---------------------------------------------------------

  private escapeRegex(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
