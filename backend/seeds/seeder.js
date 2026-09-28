/**
 * Seed Script for KRUMAK TRADERS Database
 * Populates categories, products, admin/customer users, sample orders, and inquiries.
 * 
 * Usage:
 *   node seeds/seeder.js           (Import all seed data)
 *   node seeds/seeder.js -d        (Destroy / wipe all data)
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Inquiry = require('../models/Inquiry');
const Cart = require('../models/Cart');
const ActivityLog = require('../models/ActivityLog');

const categoriesData = [
  { name: 'Analytical/Chromatography', slug: 'analytical-chromatography', icon: '🔬', image: '/categories/analytical.jpg', description: 'High-performance liquid chromatography, gas chromatography, spectrophotometers, and analytical instruments for precise laboratory analysis.' },
  { name: 'Life Science', slug: 'life-science', icon: '🧬', image: '/categories/life-science.jpg', description: 'Equipment for biological research including centrifuges, incubators, PCR machines, and cell culture systems.' },
  { name: 'Chemistry', slug: 'chemistry', icon: '⚗️', image: '/categories/chemistry.jpg', description: 'Comprehensive chemistry apparatus including flasks, beakers, burettes, condensers, and reaction vessels.' },
  { name: 'Materials Science', slug: 'materials-science', icon: '🔩', image: '/categories/materials.jpg', description: 'Testing and analysis tools for material characterization, hardness testing, and structural analysis.' },
  { name: 'Molecular Biology Kits', slug: 'molecular-biology-kits', icon: '🧪', image: '/categories/molecular.jpg', description: 'Ready-to-use kits for DNA extraction, PCR, gel electrophoresis, and molecular cloning experiments.' },
  { name: 'Biological Models', slug: 'biological-models', icon: '🫀', image: '/categories/biological.jpg', description: 'Anatomical and biological models for education and research, including organ models and cell structure displays.' },
  { name: 'Chemicals', slug: 'chemicals', icon: '🧫', image: '/categories/chemicals.jpg', description: 'Laboratory-grade chemicals, reagents, solvents, and indicators for research and educational purposes.' },
  { name: 'Microscopes', slug: 'microscopes', icon: '🔭', image: '/categories/microscopes.jpg', description: 'Optical, digital, and electron microscopes for biological, metallurgical, and educational applications.' },
  { name: 'Anatomical Models', slug: 'anatomical-models', icon: '🦴', image: '/categories/anatomical.jpg', description: 'Detailed human anatomy models including skeletal, muscular, and organ system representations.' },
  { name: 'Borosilicate Glassware', slug: 'borosilicate-glassware', icon: '🫧', image: '/categories/glassware.jpg', description: 'High-quality borosilicate glass labware resistant to thermal shock and chemical corrosion.' },
  { name: 'Plasticware', slug: 'plasticware', icon: '🥤', image: '/categories/plasticware.jpg', description: 'Disposable and reusable plastic laboratory consumables including pipette tips, tubes, and containers.' },
  { name: 'Chemical Balances', slug: 'chemical-balances', icon: '⚖️', image: '/categories/balances.jpg', description: 'Precision analytical and chemical balances for accurate weight measurements in laboratory settings.' },
  { name: 'Laboratory Apparatus', slug: 'laboratory-apparatus', icon: '🏗️', image: '/categories/apparatus.jpg', description: 'General laboratory apparatus including stands, clamps, heating mantles, and support equipment.' },
  { name: 'Educational Kits', slug: 'educational-kits', icon: '📚', image: '/categories/educational.jpg', description: 'Comprehensive science education kits for schools, colleges, and universities covering various disciplines.' },
];

const productsData = [
  {
    name: 'HPLC System - Analytical Grade',
    slug: 'hplc-system-analytical',
    category: 'analytical-chromatography',
    price: 245000,
    originalPrice: 285000,
    image: '/products/hplc.jpg',
    images: ['/products/hplc.jpg', '/products/hplc-2.jpg', '/products/hplc-3.jpg'],
    shortDescription: 'High-Performance Liquid Chromatography system for analytical laboratories',
    description: 'Professional-grade HPLC system featuring quaternary pump, autosampler with 120 vial capacity, UV-Vis detector with wavelength range 190-900nm, and advanced data processing software. Ideal for pharmaceutical, food safety, and environmental testing laboratories.',
    specifications: {
      'Flow Rate': '0.001-10 mL/min',
      'Pressure': 'Up to 600 bar',
      'Detector': 'UV-Vis DAD',
      'Wavelength': '190-900 nm',
      'Injection Volume': '0.1-100 µL',
      'Dimensions': '60 × 55 × 45 cm',
      'Weight': '35 kg',
    },
    stock: 5,
    stockQuantity: 5,
    brand: 'Shimadzu LabTech',
    SKU: 'KRM-HPLC-01',
    isFeatured: true,
    rating: 4.8,
    reviews: 24,
  },
  {
    name: 'Gas Chromatograph GC-2030',
    slug: 'gas-chromatograph-gc2030',
    category: 'analytical-chromatography',
    price: 189000,
    originalPrice: 220000,
    image: '/products/gc.jpg',
    images: ['/products/gc.jpg'],
    shortDescription: 'Advanced gas chromatograph with split/splitless injection',
    description: 'State-of-the-art gas chromatograph featuring advanced flow controller, multiple detector options (FID, TCD, ECD), and intuitive touchscreen interface. Delivers exceptional sensitivity and reproducibility for volatile compound analysis.',
    specifications: {
      'Oven Temp': '4°C above ambient to 450°C',
      'Carrier Gas': 'He, N2, H2, Ar',
      'Detectors': 'FID, TCD, ECD',
      'Injection': 'Split/Splitless',
      'Column': 'Capillary & Packed',
    },
    stock: 3,
    stockQuantity: 3,
    brand: 'KRUMAK Precision',
    SKU: 'KRM-GC-2030',
    isFeatured: true,
    rating: 4.7,
    reviews: 18,
  },
  {
    name: 'UV-Vis Spectrophotometer',
    slug: 'uv-vis-spectrophotometer',
    category: 'analytical-chromatography',
    price: 85000,
    originalPrice: 95000,
    image: '/products/spectro.jpg',
    images: ['/products/spectro.jpg'],
    shortDescription: 'Double-beam UV-Visible spectrophotometer',
    description: 'Double-beam UV-Visible spectrophotometer with wavelength range 190-1100nm. Features high-speed scanning, data storage, and USB connectivity. Perfect for quantitative analysis in research and QC labs.',
    specifications: {
      'Wavelength': '190-1100 nm',
      'Bandwidth': '0.5/1/2/4 nm',
      'Accuracy': '±0.3 nm',
      'Stray Light': '<0.05%T',
      'Display': '7-inch LCD',
    },
    stock: 12,
    stockQuantity: 12,
    brand: 'SpectraScan',
    SKU: 'KRM-SPEC-85',
    isFeatured: false,
    rating: 4.6,
    reviews: 31,
  },
  {
    name: 'Refrigerated Centrifuge',
    slug: 'refrigerated-centrifuge',
    category: 'life-science',
    price: 175000,
    originalPrice: 195000,
    image: '/products/centrifuge.jpg',
    images: ['/products/centrifuge.jpg'],
    shortDescription: 'High-speed refrigerated centrifuge with multiple rotor options',
    description: 'Professional refrigerated centrifuge with maximum speed of 25,000 RPM. Temperature range from -20°C to 40°C. Includes swing bucket and fixed angle rotors. Brushless motor ensures quiet operation and long service life.',
    specifications: {
      'Max Speed': '25,000 RPM',
      'Max RCF': '52,000 × g',
      'Temperature': '-20°C to 40°C',
      'Capacity': '4 × 750 mL',
      'Noise Level': '<55 dB',
    },
    stock: 7,
    stockQuantity: 7,
    brand: 'CentriTherm',
    SKU: 'KRM-CENT-175',
    isFeatured: true,
    rating: 4.9,
    reviews: 15,
  },
  {
    name: 'CO2 Incubator',
    slug: 'co2-incubator',
    category: 'life-science',
    price: 225000,
    originalPrice: 240000,
    image: '/products/incubator.jpg',
    images: ['/products/incubator.jpg'],
    shortDescription: 'Direct heat CO2 incubator for cell culture',
    description: 'Water-jacketed CO2 incubator providing stable temperature and CO2 control for cell culture. Features HEPA filtration, UV decontamination cycle, and IR CO2 sensor for precise atmospheric control.',
    specifications: {
      'Volume': '184 L',
      'Temperature': 'RT+5°C to 60°C',
      'CO2 Range': '0-20%',
      'Uniformity': '±0.2°C',
      'Humidity': '>95% RH',
    },
    stock: 4,
    stockQuantity: 4,
    brand: 'BioCell Pro',
    SKU: 'KRM-CO2-225',
    isFeatured: true,
    rating: 4.8,
    reviews: 9,
  },
  {
    name: 'Borosilicate Beaker Set (6 pcs)',
    slug: 'borosilicate-beaker-set',
    category: 'borosilicate-glassware',
    price: 2400,
    originalPrice: 2800,
    image: '/products/beakers.jpg',
    images: ['/products/beakers.jpg'],
    shortDescription: 'Set of 6 graduated borosilicate glass beakers',
    description: 'Premium borosilicate glass beaker set including 50mL, 100mL, 250mL, 500mL, 1000mL, and 2000mL sizes. All beakers feature clear graduation marks, spout for easy pouring, and excellent thermal shock resistance.',
    specifications: {
      'Material': 'Borosilicate Glass 3.3',
      'Sizes': '50-2000 mL',
      'Graduation': 'Printed',
      'Thermal Shock': '260°C',
      'Autoclavable': 'Yes',
    },
    stock: 50,
    stockQuantity: 50,
    brand: 'BOROSIL Prime',
    SKU: 'KRM-BEAK-SET',
    isFeatured: false,
    rating: 4.5,
    reviews: 67,
  },
  {
    name: 'Analytical Balance - 0.0001g',
    slug: 'analytical-balance-4decimal',
    category: 'chemical-balances',
    price: 68000,
    originalPrice: 75000,
    image: '/products/balance.jpg',
    images: ['/products/balance.jpg'],
    shortDescription: 'Precision analytical balance with 0.1mg readability',
    description: 'High-precision analytical balance with 0.0001g readability and 220g capacity. Features internal calibration, draft shield, and RS232/USB connectivity. Meets GLP/GMP documentation requirements.',
    specifications: {
      'Capacity': '220 g',
      'Readability': '0.0001 g',
      'Linearity': '±0.0002 g',
      'Pan Size': '80 mm diameter',
      'Calibration': 'Internal automatic',
    },
    stock: 15,
    stockQuantity: 15,
    brand: 'Precisa Weight',
    SKU: 'KRM-BAL-68',
    isFeatured: true,
    rating: 4.7,
    reviews: 22,
  },
  {
    name: 'Compound Microscope - 40x-1600x',
    slug: 'compound-microscope-1600x',
    category: 'microscopes',
    price: 28000,
    originalPrice: 32000,
    image: '/products/microscope.jpg',
    images: ['/products/microscope.jpg'],
    shortDescription: 'Trinocular compound microscope with LED illumination',
    description: 'Professional trinocular compound microscope with plan achromatic objectives. LED illumination provides consistent, cool lighting. Includes 40x, 100x, 400x, and 1600x magnification options with oil immersion lens.',
    specifications: {
      'Magnification': '40x-1600x',
      'Objectives': '4x, 10x, 40x, 100x Oil',
      'Eyepieces': 'WF10x/20',
      'Illumination': 'LED, adjustable',
      'Stage': '140×140mm mechanical',
    },
    stock: 20,
    stockQuantity: 20,
    brand: 'OpticWave',
    SKU: 'KRM-MIC-28',
    isFeatured: true,
    rating: 4.6,
    reviews: 45,
  },
  {
    name: 'DNA Extraction Kit (50 preps)',
    slug: 'dna-extraction-kit-50',
    category: 'molecular-biology-kits',
    price: 8500,
    originalPrice: 9500,
    image: '/products/dna-kit.jpg',
    images: ['/products/dna-kit.jpg'],
    shortDescription: 'Complete DNA extraction kit for genomic DNA isolation',
    description: 'Spin-column based DNA extraction kit for rapid isolation of high-quality genomic DNA from various sample types. Includes all buffers, spin columns, and collection tubes for 50 preparations.',
    specifications: {
      'Preparations': '50',
      'Sample Type': 'Blood, tissue, cells',
      'Yield': 'Up to 30 µg',
      'Purity': 'A260/A280 > 1.7',
      'Time': '< 30 minutes',
    },
    stock: 30,
    stockQuantity: 30,
    brand: 'GenePurify',
    SKU: 'KRM-DNA-85',
    isFeatured: false,
    rating: 4.4,
    reviews: 19,
  },
  {
    name: 'Human Skeleton Model - Life Size',
    slug: 'human-skeleton-model',
    category: 'anatomical-models',
    price: 12000,
    originalPrice: 15000,
    image: '/products/skeleton.jpg',
    images: ['/products/skeleton.jpg'],
    shortDescription: 'Full-size human skeleton model with stand',
    description: 'Life-size (170cm) human skeleton model made from durable PVC material. Features numbered bones, movable joints, and includes a rolling stand with dust cover. Ideal for medical education and anatomical study.',
    specifications: {
      'Height': '170 cm',
      'Material': 'PVC',
      'Joints': 'Movable',
      'Bones': 'Numbered',
      'Stand': 'Rolling metal',
    },
    stock: 8,
    stockQuantity: 8,
    brand: 'AnatomaTech',
    SKU: 'KRM-SKEL-12',
    isFeatured: false,
    rating: 4.3,
    reviews: 12,
  },
  {
    name: 'Laboratory Hotplate Stirrer',
    slug: 'laboratory-hotplate-stirrer',
    category: 'laboratory-apparatus',
    price: 18500,
    originalPrice: 21000,
    image: '/products/hotplate.jpg',
    images: ['/products/hotplate.jpg'],
    shortDescription: 'Digital hotplate magnetic stirrer with ceramic top',
    description: 'Digital hotplate magnetic stirrer featuring ceramic-coated plate for chemical resistance. Temperature range up to 380°C with PID control. Stirring speed adjustable from 100-1500 RPM.',
    specifications: {
      'Temp Range': 'RT to 380°C',
      'Plate': '135mm ceramic',
      'Stirring': '100-1500 RPM',
      'Volume': 'Up to 5L',
      'Display': 'Digital LED',
    },
    stock: 25,
    stockQuantity: 25,
    brand: 'ThermoMix',
    SKU: 'KRM-HOTP-18',
    isFeatured: false,
    rating: 4.5,
    reviews: 33,
  },
  {
    name: 'Chemistry Lab Education Kit',
    slug: 'chemistry-lab-education-kit',
    category: 'educational-kits',
    price: 15000,
    originalPrice: 18000,
    image: '/products/edu-kit.jpg',
    images: ['/products/edu-kit.jpg'],
    shortDescription: 'Complete chemistry experiment kit for students',
    description: 'Comprehensive chemistry education kit containing 100+ experiments covering acids, bases, salts, electrochemistry, organic chemistry, and more. Includes all apparatus, chemicals (safe quantities), and detailed experiment manual.',
    specifications: {
      'Experiments': '100+',
      'Grade Level': 'Higher Secondary',
      'Includes': 'Apparatus + Chemicals',
      'Manual': 'Full color, illustrated',
      'Storage': 'Wooden box',
    },
    stock: 18,
    stockQuantity: 18,
    brand: 'EduSci Prime',
    SKU: 'KRM-EDUKIT-15',
    isFeatured: true,
    rating: 4.7,
    reviews: 28,
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Inquiry.deleteMany(),
      Cart.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    console.log('[Seeder] Creating Users...');
    // Create Admin user
    const adminUser = await User.create({
      name: 'KRUMAK Admin',
      email: 'admin@krumak.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210',
      company: 'KRUMAK TRADERS HQ',
      institution: 'KRUMAK TRADERS',
    });

    // Create Customer users
    const customerUser1 = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'customer@laboratory.org',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      company: 'Indian Institute of Technology Delhi',
      institution: 'IIT Delhi - Chemistry Dept',
      addresses: [
        {
          street: 'IIT Campus, Hauz Khas',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    const customerUser2 = await User.create({
      name: 'Prof. Anita Sharma',
      email: 'anita@aiims.edu',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43211',
      company: 'AIIMS Research Cell',
      institution: 'All India Institute of Medical Sciences',
      addresses: [
        {
          street: 'Ansari Nagar East',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    const customerUser3 = await User.create({
      name: 'Mr. Vikram Singh',
      email: 'vikram@ranbaxy.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43212',
      company: 'Ranbaxy Laboratories Ltd',
      institution: 'QC Analytics Wing',
    });

    console.log('[Seeder] Creating Categories...');
    const createdCategories = await Category.insertMany(categoriesData);

    // Map category slug to ObjectId
    const categoryMap = {};
    createdCategories.forEach((c) => {
      categoryMap[c.slug] = c._id;
    });

    console.log('[Seeder] Creating Products...');
    const productsWithRefs = productsData.map((p) => ({
      ...p,
      categoryRef: categoryMap[p.category] || null,
    }));
    const createdProducts = await Product.insertMany(productsWithRefs);

    console.log('[Seeder] Creating Sample Orders...');
    await Order.create([
      {
        orderId: 'KRM-A1B2C3',
        userId: customerUser1._id,
        customer: {
          name: customerUser1.name,
          email: customerUser1.email,
          phone: customerUser1.phone,
          company: customerUser1.company,
        },
        items: [
          {
            productId: createdProducts[0]._id,
            name: createdProducts[0].name,
            quantity: 1,
            price: createdProducts[0].price,
            image: createdProducts[0].image,
            slug: createdProducts[0].slug,
          },
        ],
        shippingAddress: {
          address: 'IIT Delhi Central Store, Gate 1',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          country: 'India',
        },
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paymentDetails: {
          gateway: 'DUMMY_GATEWAY',
          transactionId: 'TXN_A1B2C3990',
          status: 'paid',
          amountPaid: 245000,
          paymentDate: new Date('2024-01-15T10:30:00Z'),
        },
        subtotal: 245000,
        tax: 44100,
        shippingCost: 0,
        totalAmount: 289100,
      },
      {
        orderId: 'KRM-D4E5F6',
        userId: customerUser2._id,
        customer: {
          name: customerUser2.name,
          email: customerUser2.email,
          phone: customerUser2.phone,
          company: customerUser2.company,
        },
        items: [
          {
            productId: createdProducts[3]._id,
            name: createdProducts[3].name,
            quantity: 1,
            price: createdProducts[3].price,
            image: createdProducts[3].image,
            slug: createdProducts[3].slug,
          },
        ],
        shippingAddress: {
          address: 'AIIMS Research Building, Room 402',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          country: 'India',
        },
        orderStatus: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        paymentDetails: {
          gateway: 'DUMMY_GATEWAY',
          transactionId: 'TXN_D4E5F6771',
          status: 'paid',
          amountPaid: 175000,
          paymentDate: new Date('2024-01-14T14:20:00Z'),
        },
        subtotal: 175000,
        tax: 31500,
        shippingCost: 0,
        totalAmount: 206500,
      },
      {
        orderId: 'KRM-G7H8I9',
        userId: customerUser3._id,
        customer: {
          name: customerUser3.name,
          email: customerUser3.email,
          phone: customerUser3.phone,
          company: customerUser3.company,
        },
        items: [
          {
            productId: createdProducts[6]._id,
            name: createdProducts[6].name,
            quantity: 2,
            price: createdProducts[6].price,
            image: createdProducts[6].image,
            slug: createdProducts[6].slug,
          },
        ],
        shippingAddress: {
          address: 'Plot 20, Sector 18, Udyog Vihar',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122015',
          country: 'India',
        },
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'po',
        paymentDetails: {
          gateway: 'PURCHASE_ORDER_NET30',
          transactionId: 'TXN_PO_RANBAXY_01',
          status: 'pending',
          amountPaid: 0,
        },
        subtotal: 136000,
        tax: 24480,
        shippingCost: 0,
        totalAmount: 160480,
      },
    ]);

    console.log('[Seeder] Creating Sample Inquiries...');
    await Inquiry.create([
      {
        inquiryId: 'INQ-001',
        name: 'Dr. Priya Patel',
        email: 'priya@bits.ac.in',
        phone: '9876543210',
        companyName: 'BITS Pilani',
        company: 'BITS Pilani',
        department: 'Chemistry Department',
        productInterest: 'Educational Kits & Beaker Sets',
        quantity: '50 sets',
        category: 'educational-kits',
        timeline: 'Immediate (within 2 weeks)',
        deliveryCity: 'Pilani, Rajasthan',
        message: 'Need institutional bulk discount quote for undergraduate chemistry batch kits.',
        status: 'open',
      },
      {
        inquiryId: 'INQ-002',
        name: 'Mr. Arun Mehta',
        email: 'arun@tcs.com',
        phone: '9876543211',
        companyName: 'TCS Life Sciences Labs',
        company: 'TCS Life Sciences Labs',
        department: 'QC Analytical Services',
        productInterest: 'HPLC System - Analytical Grade',
        quantity: '3 units',
        category: 'analytical-chromatography',
        timeline: 'Within 1 month',
        deliveryCity: 'Hyderabad',
        message: 'Setting up new QC testing facility. Need quote for 3 HPLC systems with on-site calibration & AMC.',
        status: 'resolved',
        response: 'Official quotation sent with 12% academic/corporate discount and 2-year AMC inclusion.',
        resolvedAt: new Date(),
      },
    ]);

    console.log('[Seeder] Creating Initial Admin Activity Logs...');
    await ActivityLog.create([
      {
        adminId: adminUser._id,
        adminName: adminUser.name,
        action: 'SYSTEM_INITIALIZATION',
        targetType: 'System',
        details: { message: 'Database initialized with 14 categories and 12 baseline laboratory equipment products.' },
      },
    ]);

    console.log('=============================================================');
    console.log('  KRUMAK TRADERS SEED DATA IMPORTED SUCCESSFULLY!  ');
    console.log('=============================================================');
    console.log('Demo Credentials:');
    console.log('  Admin:    admin@krumak.com    / admin123');
    console.log('  Customer: customer@laboratory.org / password123');
    console.log('=============================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to seed data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Destroying all data...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Inquiry.deleteMany(),
      Cart.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    console.log('[Seeder] All database records deleted.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to destroy data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
