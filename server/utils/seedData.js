const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();

const sampleProducts = [
  {
    name: 'Hydrating Hyaluronic Acid Serum',
    description: 'Ultra-lightweight multi-depth hydration serum enriched with vitamin B5 and soothing botanical extracts.',
    category: 'Skincare',
    brand: 'Lumina Pure',
    price: 3800,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Botanical Nourishing Face Cream',
    description: 'Deeply rejuvenating day and night moisturizer infused with ceramides and green tea extract for a radiant glow.',
    category: 'Skincare',
    brand: 'Flora Derm',
    price: 4200,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Gentle Foaming Tea Tree Cleanser',
    description: 'Purifying face wash formulated for blemish-prone and sensitive skin, clearing pores without stripping moisture.',
    category: 'Skincare',
    brand: 'DermaFresh',
    price: 2600,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Rose Gold Velvet Matte Lipstick',
    description: 'Long-lasting pigmented lipstick with nourishing jojoba oil and a comfortable, feather-light matte finish.',
    category: 'Makeup',
    brand: 'Glamour Velvet',
    price: 3200,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Weightless Satin Liquid Foundation SPF 30',
    description: 'Buildable medium-to-full coverage foundation that seamlessly blends, creating a soft-focus radiant complexion.',
    category: 'Makeup',
    brand: 'Lumina Pure',
    price: 5400,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Volumizing Biotin Hair Shampoo',
    description: 'Sulfate-free strengthening shampoo packed with plant keratin and biotin to boost volume and scalp health.',
    category: 'Haircare',
    brand: 'Botanica Luxe',
    price: 3500,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Deep Repair Argan Oil Hair Mask',
    description: 'Intensive restorative conditioning mask formulated to repair split ends and infuse brittle hair with brilliant shine.',
    category: 'Haircare',
    brand: 'Botanica Luxe',
    price: 4600,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1608248597359-5f284e311a2f?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Shea & Cocoa Butter Body Cream',
    description: 'Rich, whipped body butter that melts into the skin for 48-hour continuous moisture and silky softness.',
    category: 'Body Care',
    brand: 'Pure Glow',
    price: 2900,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Exfoliating Sea Salt Body Scrub',
    description: 'Invigorating mineral-rich body polish that buffs away dullness and revitalizes dry skin.',
    category: 'Body Care',
    brand: 'DermaFresh',
    price: 3100,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Jasmine Blossom Eau De Parfum',
    description: 'Elegant fragrance featuring fresh notes of night-blooming jasmine, bergamot, and warm white musk.',
    category: 'Fragrance',
    brand: 'Atelier Scents',
    price: 8500,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Sandalwood & Amber Body Mist',
    description: 'Subtle all-over fragrance spray with warm woody undertones and delicate golden vanilla.',
    category: 'Fragrance',
    brand: 'Atelier Scents',
    price: 6200,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    isActive: true
  },
  {
    name: 'Organic Aloe Soothing Sunscreen SPF 50',
    description: 'Broad-spectrum mineral sun protection that absorbs instantly with zero white cast.',
    category: 'Personal Care',
    brand: 'Flora Derm',
    price: 3400,
    stock: 0, // Demonstrates out-of-stock state
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    isActive: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Previous data cleared.');

    // Create Admin User
    const adminPassword = await bcrypt.hash('adminpassword123', 10);
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@lumina.com',
      password: adminPassword,
      phone: '0770000000',
      role: 'admin'
    });

    // Create Customer User
    const customerPassword = await bcrypt.hash('customerpassword123', 10);
    const customerUser = await User.create({
      name: 'Nimasha Perera',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '0771234567',
      role: 'customer'
    });

    // Insert Products
    await Product.insertMany(sampleProducts);

    console.log('Sample cosmetics products seeded successfully!');
    console.log('Default Admin Account: admin@lumina.com / adminpassword123');
    console.log('Default Customer Account: customer@example.com / customerpassword123');

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
