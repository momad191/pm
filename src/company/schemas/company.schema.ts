import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

export enum SubscriptionPlan {
  FREE = 'FREE',

  STARTER = 'STARTER',

  PROFESSIONAL = 'PROFESSIONAL',

  ENTERPRISE = 'ENTERPRISE',
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  SUSPENDED = 'SUSPENDED',
}

@Schema({
  timestamps: true,
})
export class Company {

  @Prop({
    type: Types.ObjectId,
    ref: 'Subscription',
    required: false,
  })
  subscriptionId: Types.ObjectId;


  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  ref: Types.ObjectId;


  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  updatedBy: Types.ObjectId;


  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  companyId: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
    index: true,
  })
  companyName: string;


  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
    index: true,
  })
  companyNameArabic: string;


  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
    index: true,
  })
  language: string;


  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  legalName: string;



  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  managerFirstName: string;


  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  managerLastName: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  industry?: string;

  @Prop({
    trim: true,
    maxlength: 3000,
  })
  description: string;

  @Prop({
    trim: true,
    maxlength: 300,
  })
  website: string;

  @Prop({
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;


  @Prop({
    trim: true,
    maxlength: 30,
  })
  phone: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  address: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  city: string;

  @Prop({
    trim: true,
    maxlength: 100,
    index: true,
  })
  country: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  timezone: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  currency: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  logo: string;

  @Prop({
    default: 0,
  })
  employeesCount: number;

  @Prop({
    default: 0,
  })
  projectsCount: number;

  @Prop({
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
    index: true,
  })
  status: CompanyStatus;

  @Prop({
    default: false,
    index: true,
  })
  isDeleted: boolean;

  @Prop({
    trim: true,
    maxlength: 100,
    required: false
  })
  commercialRegistration: string;

  @Prop({
    trim: true,
    maxlength: 100,
    required: false
  })
  taxNumber: string;

  @Prop({
    trim: true,
    maxlength: 100,

  })
  ownerName: string;

  @Prop({
    lowercase: true,
    trim: true,
    required: false
  })
  ownerEmail: string;

  @Prop({
    trim: true,
    maxlength: 20,
    required: false
  })
  ownerPhone: string;

  @Prop({
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan: SubscriptionPlan;

  @Prop({
    default: 10,
  })
  maxUsers: number;

  @Prop({
    default: 5,
  })
  maxProjects: number;

  @Prop({
    default: 1024,
  })
  storageLimit: number;

  @Prop()
  lastLogin: Date;

  @Prop()
  end_subscription_date?: Date
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// CompanySchema.index({
//   companyId: 1,
// });

// CompanySchema.index({
//   companyName: 1,
// });

CompanySchema.index({
  industry: 1,
});

// CompanySchema.index({
//   status: 1,
// });

// CompanySchema.index({
//   country: 1,
// });

CompanySchema.index({
  city: 1,
});

// CompanySchema.index({
//   isDeleted: 1,
// });

// CompanySchema.index({
//   email: 1,
// });

CompanySchema.index({
  phone: 1,
});

CompanySchema.index({
  employeesCount: -1,
});

CompanySchema.index({
  projectsCount: -1,
});

CompanySchema.index({
  companyName: 'text',
  description: 'text',
});

CompanySchema.index({
  commercialRegistration: 1,
});

CompanySchema.index({
  taxNumber: 1,
});
