/**
 * Mock Data for KRUMAK TRADERS
 * Used as fallback when backend API is unavailable.
 * Provides realistic laboratory equipment data.
 */

export const categories = [
  { id: 'analytical-chromatography', name: 'Analytical/Chromatography', icon: '🔬', image: '/categories/analytical.jpg', description: 'High-performance liquid chromatography, gas chromatography, spectrophotometers, and analytical instruments for precise laboratory analysis.' },
  { id: 'life-science', name: 'Life Science', icon: '🧬', image: '/categories/life-science.jpg', description: 'Equipment for biological research including centrifuges, incubators, PCR machines, and cell culture systems.' },
  { id: 'chemistry', name: 'Chemistry', icon: '⚗️', image: '/categories/chemistry.jpg', description: 'Comprehensive chemistry apparatus including flasks, beakers, burettes, condensers, and reaction vessels.' },
  { id: 'materials-science', name: 'Materials Science', icon: '🔩', image: '/categories/materials.jpg', description: 'Testing and analysis tools for material characterization, hardness testing, and structural analysis.' },
  { id: 'molecular-biology-kits', name: 'Molecular Biology Kits', icon: '🧪', image: '/categories/molecular.jpg', description: 'Ready-to-use kits for DNA extraction, PCR, gel electrophoresis, and molecular cloning experiments.' },
  { id: 'biological-models', name: 'Biological Models', icon: '🫀', image: '/categories/biological.jpg', description: 'Anatomical and biological models for education and research, including organ models and cell structure displays.' },
  { id: 'chemicals', name: 'Chemicals', icon: '🧫', image: '/categories/chemicals.jpg', description: 'Laboratory-grade chemicals, reagents, solvents, and indicators for research and educational purposes.' },
  { id: 'microscopes', name: 'Microscopes', icon: '🔭', image: '/categories/microscopes.jpg', description: 'Optical, digital, and electron microscopes for biological, metallurgical, and educational applications.' },
  { id: 'anatomical-models', name: 'Anatomical Models', icon: '🦴', image: '/categories/anatomical.jpg', description: 'Detailed human anatomy models including skeletal, muscular, and organ system representations.' },
  { id: 'borosilicate-glassware', name: 'Borosilicate Glassware', icon: '🫧', image: '/categories/glassware.jpg', description: 'High-quality borosilicate glass labware resistant to thermal shock and chemical corrosion.' },
  { id: 'plasticware', name: 'Plasticware', icon: '🥤', image: '/categories/plasticware.jpg', description: 'Disposable and reusable plastic laboratory consumables including pipette tips, tubes, and containers.' },
  { id: 'chemical-balances', name: 'Chemical Balances', icon: '⚖️', image: '/categories/balances.jpg', description: 'Precision analytical and chemical balances for accurate weight measurements in laboratory settings.' },
  { id: 'laboratory-apparatus', name: 'Laboratory Apparatus', icon: '🏗️', image: '/categories/apparatus.jpg', description: 'General laboratory apparatus including stands, clamps, heating mantles, and support equipment.' },
  { id: 'educational-kits', name: 'Educational Kits', icon: '📚', image: '/categories/educational.jpg', description: 'Comprehensive science education kits for schools, colleges, and universities covering various disciplines.' },
];

export const products = [
  { id: '1', name: 'HPLC System - Analytical Grade', slug: 'hplc-system-analytical', category: 'analytical-chromatography', price: 245000, originalPrice: 285000, image: '/products/hplc.jpg', images: ['/products/hplc.jpg', '/products/hplc-2.jpg', '/products/hplc-3.jpg'], shortDescription: 'High-Performance Liquid Chromatography system for analytical laboratories', description: 'Professional-grade HPLC system featuring quaternary pump, autosampler with 120 vial capacity, UV-Vis detector with wavelength range 190-900nm, and advanced data processing software. Ideal for pharmaceutical, food safety, and environmental testing laboratories.', specifications: { 'Flow Rate': '0.001-10 mL/min', 'Pressure': 'Up to 600 bar', 'Detector': 'UV-Vis DAD', 'Wavelength': '190-900 nm', 'Injection Volume': '0.1-100 µL', 'Dimensions': '60 × 55 × 45 cm', 'Weight': '35 kg' }, stock: 5, rating: 4.8, reviews: 24, featured: true },
  { id: '2', name: 'Gas Chromatograph GC-2030', slug: 'gas-chromatograph-gc2030', category: 'analytical-chromatography', price: 189000, originalPrice: 220000, image: '/products/gc.jpg', images: ['/products/gc.jpg'], shortDescription: 'Advanced gas chromatograph with split/splitless injection', description: 'State-of-the-art gas chromatograph featuring advanced flow controller, multiple detector options (FID, TCD, ECD), and intuitive touchscreen interface. Delivers exceptional sensitivity and reproducibility for volatile compound analysis.', specifications: { 'Oven Temp': '4°C above ambient to 450°C', 'Carrier Gas': 'He, N2, H2, Ar', 'Detectors': 'FID, TCD, ECD', 'Injection': 'Split/Splitless', 'Column': 'Capillary & Packed' }, stock: 3, rating: 4.7, reviews: 18, featured: true },
  { id: '3', name: 'UV-Vis Spectrophotometer', slug: 'uv-vis-spectrophotometer', category: 'analytical-chromatography', price: 85000, originalPrice: null, image: '/products/spectro.jpg', images: ['/products/spectro.jpg'], shortDescription: 'Double-beam UV-Visible spectrophotometer', description: 'Double-beam UV-Visible spectrophotometer with wavelength range 190-1100nm. Features high-speed scanning, data storage, and USB connectivity. Perfect for quantitative analysis in research and QC labs.', specifications: { 'Wavelength': '190-1100 nm', 'Bandwidth': '0.5/1/2/4 nm', 'Accuracy': '±0.3 nm', 'Stray Light': '<0.05%T', 'Display': '7-inch LCD' }, stock: 12, rating: 4.6, reviews: 31, featured: false },
  { id: '4', name: 'Refrigerated Centrifuge', slug: 'refrigerated-centrifuge', category: 'life-science', price: 175000, originalPrice: 195000, image: '/products/centrifuge.jpg', images: ['/products/centrifuge.jpg'], shortDescription: 'High-speed refrigerated centrifuge with multiple rotor options', description: 'Professional refrigerated centrifuge with maximum speed of 25,000 RPM. Temperature range from -20°C to 40°C. Includes swing bucket and fixed angle rotors. Brushless motor ensures quiet operation and long service life.', specifications: { 'Max Speed': '25,000 RPM', 'Max RCF': '52,000 × g', 'Temperature': '-20°C to 40°C', 'Capacity': '4 × 750 mL', 'Noise Level': '<55 dB' }, stock: 7, rating: 4.9, reviews: 15, featured: true },
  { id: '5', name: 'CO2 Incubator', slug: 'co2-incubator', category: 'life-science', price: 225000, originalPrice: null, image: '/products/incubator.jpg', images: ['/products/incubator.jpg'], shortDescription: 'Direct heat CO2 incubator for cell culture', description: 'Water-jacketed CO2 incubator providing stable temperature and CO2 control for cell culture. Features HEPA filtration, UV decontamination cycle, and IR CO2 sensor for precise atmospheric control.', specifications: { 'Volume': '184 L', 'Temperature': 'RT+5°C to 60°C', 'CO2 Range': '0-20%', 'Uniformity': '±0.2°C', 'Humidity': '>95% RH' }, stock: 4, rating: 4.8, reviews: 9, featured: true },
  { id: '6', name: 'Borosilicate Beaker Set (6 pcs)', slug: 'borosilicate-beaker-set', category: 'borosilicate-glassware', price: 2400, originalPrice: 2800, image: '/products/beakers.jpg', images: ['/products/beakers.jpg'], shortDescription: 'Set of 6 graduated borosilicate glass beakers', description: 'Premium borosilicate glass beaker set including 50mL, 100mL, 250mL, 500mL, 1000mL, and 2000mL sizes. All beakers feature clear graduation marks, spout for easy pouring, and excellent thermal shock resistance.', specifications: { 'Material': 'Borosilicate Glass 3.3', 'Sizes': '50-2000 mL', 'Graduation': 'Printed', 'Thermal Shock': '260°C', 'Autoclavable': 'Yes' }, stock: 50, rating: 4.5, reviews: 67, featured: false },
  { id: '7', name: 'Analytical Balance - 0.0001g', slug: 'analytical-balance-4decimal', category: 'chemical-balances', price: 68000, originalPrice: 75000, image: '/products/balance.jpg', images: ['/products/balance.jpg'], shortDescription: 'Precision analytical balance with 0.1mg readability', description: 'High-precision analytical balance with 0.0001g readability and 220g capacity. Features internal calibration, draft shield, and RS232/USB connectivity. Meets GLP/GMP documentation requirements.', specifications: { 'Capacity': '220 g', 'Readability': '0.0001 g', 'Linearity': '±0.0002 g', 'Pan Size': '80 mm diameter', 'Calibration': 'Internal automatic' }, stock: 15, rating: 4.7, reviews: 22, featured: true },
  { id: '8', name: 'Compound Microscope - 40x-1600x', slug: 'compound-microscope-1600x', category: 'microscopes', price: 28000, originalPrice: 32000, image: '/products/microscope.jpg', images: ['/products/microscope.jpg'], shortDescription: 'Trinocular compound microscope with LED illumination', description: 'Professional trinocular compound microscope with plan achromatic objectives. LED illumination provides consistent, cool lighting. Includes 40x, 100x, 400x, and 1600x magnification options with oil immersion lens.', specifications: { 'Magnification': '40x-1600x', 'Objectives': '4x, 10x, 40x, 100x Oil', 'Eyepieces': 'WF10x/20', 'Illumination': 'LED, adjustable', 'Stage': '140×140mm mechanical' }, stock: 20, rating: 4.6, reviews: 45, featured: true },
  { id: '9', name: 'DNA Extraction Kit (50 preps)', slug: 'dna-extraction-kit-50', category: 'molecular-biology-kits', price: 8500, originalPrice: null, image: '/products/dna-kit.jpg', images: ['/products/dna-kit.jpg'], shortDescription: 'Complete DNA extraction kit for genomic DNA isolation', description: 'Spin-column based DNA extraction kit for rapid isolation of high-quality genomic DNA from various sample types. Includes all buffers, spin columns, and collection tubes for 50 preparations.', specifications: { 'Preparations': '50', 'Sample Type': 'Blood, tissue, cells', 'Yield': 'Up to 30 µg', 'Purity': 'A260/A280 > 1.7', 'Time': '< 30 minutes' }, stock: 30, rating: 4.4, reviews: 19, featured: false },
  { id: '10', name: 'Human Skeleton Model - Life Size', slug: 'human-skeleton-model', category: 'anatomical-models', price: 12000, originalPrice: 15000, image: '/products/skeleton.jpg', images: ['/products/skeleton.jpg'], shortDescription: 'Full-size human skeleton model with stand', description: 'Life-size (170cm) human skeleton model made from durable PVC material. Features numbered bones, movable joints, and includes a rolling stand with dust cover. Ideal for medical education and anatomical study.', specifications: { 'Height': '170 cm', 'Material': 'PVC', 'Joints': 'Movable', 'Bones': 'Numbered', 'Stand': 'Rolling metal' }, stock: 8, rating: 4.3, reviews: 12, featured: false },
  { id: '11', name: 'Laboratory Hotplate Stirrer', slug: 'laboratory-hotplate-stirrer', category: 'laboratory-apparatus', price: 18500, originalPrice: null, image: '/products/hotplate.jpg', images: ['/products/hotplate.jpg'], shortDescription: 'Digital hotplate magnetic stirrer with ceramic top', description: 'Digital hotplate magnetic stirrer featuring ceramic-coated plate for chemical resistance. Temperature range up to 380°C with PID control. Stirring speed adjustable from 100-1500 RPM.', specifications: { 'Temp Range': 'RT to 380°C', 'Plate': '135mm ceramic', 'Stirring': '100-1500 RPM', 'Volume': 'Up to 5L', 'Display': 'Digital LED' }, stock: 25, rating: 4.5, reviews: 33, featured: false },
  { id: '12', name: 'Chemistry Lab Education Kit', slug: 'chemistry-lab-education-kit', category: 'educational-kits', price: 15000, originalPrice: 18000, image: '/products/edu-kit.jpg', images: ['/products/edu-kit.jpg'], shortDescription: 'Complete chemistry experiment kit for students', description: 'Comprehensive chemistry education kit containing 100+ experiments covering acids, bases, salts, electrochemistry, organic chemistry, and more. Includes all apparatus, chemicals (safe quantities), and detailed experiment manual.', specifications: { 'Experiments': '100+', 'Grade Level': 'Higher Secondary', 'Includes': 'Apparatus + Chemicals', 'Manual': 'Full color, illustrated', 'Storage': 'Wooden box' }, stock: 18, rating: 4.7, reviews: 28, featured: true },
];

export const testimonials = [
  { id: 1, name: 'Dr. Rajesh Kumar', role: 'Head of Chemistry, IIT Delhi', text: 'KRUMAK TRADERS has been our trusted supplier for over 5 years. Their equipment quality and after-sales service is exceptional.', rating: 5 },
  { id: 2, name: 'Prof. Anita Sharma', role: 'Research Director, AIIMS', text: 'We equipped our entire molecular biology lab through KRUMAK. Competitive pricing and timely delivery every single time.', rating: 5 },
  { id: 3, name: 'Mr. Vikram Singh', role: 'Lab Manager, Ranbaxy Labs', text: 'From glassware to chromatography systems — KRUMAK TRADERS is our one-stop solution for all laboratory needs.', rating: 4 },
  { id: 4, name: 'Dr. Priya Patel', role: 'Professor, BITS Pilani', text: 'The educational kits from KRUMAK have transformed our practical sessions. Students love the hands-on experience.', rating: 5 },
];

export const companyInfo = {
  name: 'KRUMAK TRADERS',
  tagline: 'Your Trusted Partner in Laboratory Excellence',
  experience: '10+',
  description: 'KRUMAK TRADERS is a professional firm with over 10 years of experience in supplying high-quality laboratory and scientific equipment. We serve educational institutions, research laboratories, pharmaceutical companies, and industrial testing facilities across the country.',
  fullDescription: `KRUMAK TRADERS is a premier supplier of laboratory and scientific equipment, serving the needs of educational institutions, research organizations, pharmaceutical companies, and industrial laboratories for over a decade.

Our comprehensive product range includes Analytical/Chromatography instruments, Life Science equipment, Chemistry apparatus, Materials Science tools, Molecular Biology Kits, Biological Models, Chemicals, Microscopes, Anatomical Models, Borosilicate Glassware, Plasticware, Chemical Balances, Laboratory Apparatus, and Educational Kits.

We pride ourselves on offering:
• Premium quality products from reputed manufacturers
• Competitive pricing with transparent quotations
• Prompt delivery and reliable logistics
• Expert technical consultation and support
• After-sales service and maintenance
• Customized solutions for institutional requirements

Our team of experienced professionals understands the unique requirements of scientific research and education. We work closely with our clients to provide tailored solutions that meet their specific needs and budget constraints.

Whether you are setting up a new laboratory, upgrading existing equipment, or sourcing consumables for ongoing research, KRUMAK TRADERS is your trusted partner in laboratory excellence.`,
  address: '123, Industrial Area, Phase-II, New Delhi - 110020, India',
  phone: '+91-9876543210',
  altPhone: '+91-9876543211',
  email: 'info@krumaktraders.com',
  salesEmail: 'sales@krumaktraders.com',
  website: 'www.krumaktraders.com',
  social: {
    facebook: 'https://facebook.com/krumaktraders',
    twitter: 'https://twitter.com/krumaktraders',
    linkedin: 'https://linkedin.com/company/krumaktraders',
    instagram: 'https://instagram.com/krumaktraders',
  },
  stats: [
    { label: 'Years Experience', value: '10+' },
    { label: 'Products', value: '5000+' },
    { label: 'Happy Clients', value: '500+' },
    { label: 'Cities Served', value: '100+' },
  ],
};
