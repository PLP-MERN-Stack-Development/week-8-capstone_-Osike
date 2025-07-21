import mongoose from 'mongoose';

const partnerLawFirmSchema = new mongoose.Schema({
  firm_name: {
    type: String,
    required: true,
    index: true
  },
  description_en: {
    type: String,
    required: true
  },
  description_sw: {
    type: String,
    required: true
  },
  specializations: [{
    type: String,
    enum: [
      'family-law',
      'criminal-law',
      'corporate-law',
      'property-law',
      'employment-law',
      'human-rights',
      'immigration-law',
      'tax-law',
      'intellectual-property',
      'environmental-law',
      'constitutional-law',
      'commercial-litigation',
      'debt-recovery',
      'insurance-law',
      'banking-law'
    ],
    index: true
  }],
  location: {
    type: String,
    required: true,
    enum: ['mombasa', 'nairobi', 'coastal', 'central', 'western', 'eastern', 'northern', 'rift-valley'],
    index: true
  },
  contact_email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  contact_phone: {
    type: String,
    required: true
  },
  website_url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  physical_address: {
    type: String,
    required: true
  },
  is_sponsored: {
    type: Boolean,
    default: false,
    index: true
  },
  sponsorship_tier: {
    type: String,
    enum: ['basic', 'premium', 'featured'],
    default: 'basic'
  },
  logo_url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  rating: {
    average: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    count: {
      type: Number,
      default: 0
    }
  },
  years_of_experience: {
    type: Number,
    min: 0
  },
  number_of_lawyers: {
    type: Number,
    min: 1
  },
  languages_supported: [{
    type: String,
    enum: ['english', 'kiswahili', 'kikuyu', 'luo', 'kamba', 'kalenjin', 'kisii', 'meru', 'mijikenda'],
    default: ['english', 'kiswahili']
  }],
  operating_hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
    notes: String
  },
  services_offered: [{
    service_name_en: String,
    service_name_sw: String,
    description_en: String,
    description_sw: String
  }],
  consultation_fee: {
    type: String,
    enum: ['free', 'paid', 'varies'],
    default: 'varies'
  },
  emergency_services: {
    available: {
      type: Boolean,
      default: false
    },
    phone: String,
    hours: String
  },
  verification_status: {
    type: String,
    enum: ['verified', 'pending', 'unverified'],
    default: 'pending',
    index: true
  },
  verification_documents: [{
    document_type: String,
    document_url: String,
    verified_at: Date
  }],
  partnership_start_date: {
    type: Date,
    default: Date.now
  },
  partnership_end_date: Date,
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  featured_until: Date,
  payment_status: {
    type: String,
    enum: ['current', 'overdue', 'suspended'],
    default: 'current'
  },
  seo_keywords: [{
    type: String,
    lowercase: true
  }],
  social_media: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  testimonials: [{
    client_name: String,
    testimonial_en: String,
    testimonial_sw: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  click_count: {
    type: Number,
    default: 0
  },
  last_clicked: Date,
  monthly_clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
partnerLawFirmSchema.index({ specializations: 1, location: 1 });
partnerLawFirmSchema.index({ is_sponsored: 1, sponsorship_tier: 1 });
partnerLawFirmSchema.index({ is_active: 1, verification_status: 1 });
partnerLawFirmSchema.index({ featured_until: 1 });
partnerLawFirmSchema.index({ '$**': 'text' }); // Text search index

// Virtual for full address
partnerLawFirmSchema.virtual('full_contact_info').get(function() {
  return {
    email: this.contact_email,
    phone: this.contact_phone,
    website: this.website_url,
    address: this.physical_address
  };
});

// Virtual for active sponsorship
partnerLawFirmSchema.virtual('is_currently_sponsored').get(function() {
  return this.is_sponsored && 
         this.payment_status === 'current' && 
         this.is_active &&
         (!this.partnership_end_date || this.partnership_end_date > new Date());
});

// Virtual for featured status
partnerLawFirmSchema.virtual('is_featured').get(function() {
  return this.featured_until && this.featured_until > new Date();
});

// Static method to find active firms
partnerLawFirmSchema.statics.findActiveFirms = function(filters = {}) {
  const query = { 
    is_active: true, 
    verification_status: 'verified',
    payment_status: 'current'
  };

  if (filters.location) {
    query.location = filters.location;
  }

  if (filters.specialization) {
    query.specializations = filters.specialization;
  }

  if (filters.sponsored_only) {
    query.is_sponsored = true;
  }

  return this.find(query).sort({ 
    is_sponsored: -1, 
    sponsorship_tier: 1, 
    rating: -1,
    firm_name: 1 
  });
};

// Static method to search firms
partnerLawFirmSchema.statics.searchFirms = function(query, filters = {}) {
  const searchQuery = {
    is_active: true,
    verification_status: 'verified',
    $or: [
      { firm_name: { $regex: query, $options: 'i' } },
      { description_en: { $regex: query, $options: 'i' } },
      { description_sw: { $regex: query, $options: 'i' } },
      { specializations: { $in: [new RegExp(query, 'i')] } },
      { seo_keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (filters.location) {
    searchQuery.location = filters.location;
  }

  if (filters.specialization) {
    searchQuery.specializations = filters.specialization;
  }

  return this.find(searchQuery).sort({ 
    is_sponsored: -1, 
    rating: -1,
    firm_name: 1 
  });
};

// Instance method to increment click count
partnerLawFirmSchema.methods.incrementClickCount = function() {
  this.click_count += 1;
  this.monthly_clicks += 1;
  this.last_clicked = new Date();
  return this.save();
};

// Instance method to add testimonial
partnerLawFirmSchema.methods.addTestimonial = function(testimonialData) {
  this.testimonials.push(testimonialData);
  
  // Recalculate average rating
  const verifiedTestimonials = this.testimonials.filter(t => t.verified && t.rating);
  if (verifiedTestimonials.length > 0) {
    const totalRating = verifiedTestimonials.reduce((sum, t) => sum + t.rating, 0);
    this.rating.average = totalRating / verifiedTestimonials.length;
    this.rating.count = verifiedTestimonials.length;
  }
  
  return this.save();
};

// Pre-save middleware to handle sponsorship logic
partnerLawFirmSchema.pre('save', function(next) {
  // Set featured_until based on sponsorship tier
  if (this.is_sponsored && this.sponsorship_tier === 'featured' && !this.featured_until) {
    this.featured_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  // Ensure sponsored firms are verified
  if (this.is_sponsored && this.verification_status !== 'verified') {
    this.verification_status = 'pending';
  }

  next();
});

export default mongoose.model('PartnerLawFirm', partnerLawFirmSchema);