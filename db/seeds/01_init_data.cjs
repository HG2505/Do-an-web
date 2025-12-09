const bcrypt = require('bcryptjs'); 

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // 1. Dọn dẹp dữ liệu cũ (Xóa sản phẩm trước -> xóa danh mục sau)
  console.log('🧹 Đang dọn dẹp dữ liệu cũ...');
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del(); // Reset luôn user để tạo lại admin chuẩn

  // 2. Tạo Users mẫu (Mật khẩu '123')
  console.log('👤 Đang tạo tài khoản mẫu...');
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('123', salt);

  await knex('users').insert([
    { 
      username: 'admin', 
      password: hashedPassword, 
      name: 'Quản Trị Viên', 
      email: 'admin@pcstore.com', 
      role: 'admin' 
    },
    { 
      username: 'khachhang', 
      password: hashedPassword, 
      name: 'Nguyễn Văn A', 
      email: 'user@example.com', 
      role: 'user' 
    }
  ]);

  // 3. Tạo Danh mục
  console.log('📂 Đang tạo danh mục...');
  const categoriesData = [
    { code: 'vga', title: 'Card màn hình (VGA)' },
    { code: 'ram', title: 'Bộ nhớ trong (RAM)' },
    { code: 'mainboard', title: 'Bo mạch chủ (Mainboard)' },
    { code: 'ssd', title: 'Ổ cứng (SSD)' },
    { code: 'cpu', title: 'Vi xử lý (CPU)' }
  ];

  // Insert và lấy lại ID
  const insertedCats = await knex('categories')
    .insert(categoriesData.map(c => ({ title: c.title })))
    .returning(['id', 'title']);

  // Hàm helper tìm ID theo code
  const getCatId = (code) => {
    const mapTitle = categoriesData.find(c => c.code === code).title;
    const cat = insertedCats.find(c => c.title === mapTitle);
    return cat ? cat.id : 1; 
  };

  // 4. Dữ liệu Sản phẩm (Đã khớp chính xác tên file ảnh của bạn)
  console.log('📦 Đang thêm sản phẩm...');
  
  const products = [
    // === 1. VGA (Card màn hình) ===
    {
        title: "ASUS ROG STRIX RTX 4090",
        price: 55000000,
        description: "Siêu phẩm đồ họa, trùm cuối hiệu năng gaming 4K.",
        category_code: "vga",
        image: "ASUS ROG STRIX RTX 4090.webp"
    },
    {
        title: "Gigabyte GeForce RTX 4070 Ti AERO",
        price: 24500000,
        description: "Thiết kế màu trắng tuyệt đẹp, hiệu năng cực mạnh.",
        category_code: "vga",
        image: "Gigabyte GeForce RTX 4070 Ti AERO.webp"
    },
    {
        title: "GIGABYTE GEFORCE RTX 5060 Ti",
        price: 15500000,
        description: "Dòng card thế hệ mới hiệu năng tối ưu.",
        category_code: "vga",
        image: "GIGABYTE GEFORCE RTX 5060 Ti.webp"
    },
    {
        title: "Gigabyte GeForce RTX 3060",
        price: 7500000,
        description: "Card quốc dân, chiến mượt mọi game FullHD.",
        category_code: "vga",
        image: "Gigabyte GeForce RTX™ 3060.webp" // Đã khớp ký tự ™
    },
    {
        title: "MSI GeForce RTX 3050 Ventus 2x",
        price: 5500000,
        description: "Giá rẻ, nhỏ gọn, phù hợp case mini, hiệu năng ổn.",
        category_code: "vga",
        image: "MSI GeForce RTX 3050 Ventus 2x.webp"
    },

    // === 2. RAM (Bộ nhớ trong) ===
    {
        title: "GSkill Trident Z5",
        price: 3200000,
        description: "RAM DDR5 cao cấp, thiết kế sắc sảo, LED RGB cực đẹp.",
        category_code: "ram",
        image: "GSkill Trident Z5.webp"
    },
    {
        title: "RAM ADATA XPG D50",
        price: 1150000,
        description: "Màu trắng tinh khôi, LED RGB Geometric độc đáo.",
        category_code: "ram",
        image: "RAM ADATA XPG D50.webp"
    },
    {
        title: "RAM DDR4 Kingston",
        price: 450000,
        description: "Bền bỉ, ổn định, tương thích mọi loại mainboard.",
        category_code: "ram",
        image: "RAM DDR4 Kingston.webp"
    },
    {
        title: "Ram PC Corsair Vengeance",
        price: 1350000,
        description: "Hiệu năng cao, LED RGB tùy chỉnh chuyên nghiệp.",
        category_code: "ram",
        image: "Ram PC Corsair Vengeance.webp"
    },
    {
        title: "Team T Force Delta R",
        price: 1250000,
        description: "Thiết kế góc rộng 120 độ, LED RGB rực rỡ.",
        category_code: "ram",
        image: "Team T Force Delta R.webp"
    },

    // === 3. MAINBOARD (Bo mạch chủ) ===
    {
        title: "Gigabyte AORUS Z890 A ELITE WF",
        price: 9500000,
        description: "Mainboard cao cấp cho Intel thế hệ mới, màu trắng sang trọng.",
        category_code: "mainboard",
        image: "Mainboard Gigabyte AORUS Z890 A ELITE WF7 ICE.webp" // Đã khớp hậu tố WF7 ICE
    },
    {
        title: "MSI B650M GAMING PLUS WIFI DDR5",
        price: 4200000,
        description: "Hỗ trợ AMD Ryzen 7000, có Wifi 6E, tản nhiệt tốt.",
        category_code: "mainboard",
        image: "Mainboard MSI B650M GAMING PLUS WIFI DDR5.webp"
    },
    {
        title: "Msi B760M Gaming WF DDR5",
        price: 3800000,
        description: "Tối ưu cho Intel Gen 12/13/14, hỗ trợ RAM DDR5.",
        category_code: "mainboard",
        image: "Mainboard Msi B760M Gaming WF DDR5.webp"
    },
    {
        title: "MSI MAG Z890 TOMAHAWK",
        price: 8900000,
        description: "Dòng Tomahawk huyền thoại, bền bỉ chuẩn quân đội.",
        category_code: "mainboard",
        image: "Mainboard MSI MAG MAG Z890 TOMAHAWK DDR5 - Wifi 7.webp" // Đã khớp hậu tố Wifi 7
    },
    {
        title: "Msi PRO B840M-P WIFI6E",
        price: 2900000,
        description: "Giải pháp kinh tế, đầy đủ tính năng văn phòng và game nhẹ.",
        category_code: "mainboard",
        image: "Mainboard Msi PRO B840M-P WIFI6E.webp"
    },

    // === 4. SSD (Ổ cứng) ===
    {
        title: "SSD NVMe 1TB KIOXIA EXCERIA",
        price: 1450000,
        description: "Công nghệ Nhật Bản, tốc độ đọc ghi ổn định.",
        category_code: "ssd",
        image: "SSD NVMe 1TB KIOXIA EXCERIA.webp"
    },
    {
        title: "SSD Samsung 9100 Pro",
        price: 2800000,
        description: "Tốc độ siêu nhanh, độ bền cao, bảo hành dài.",
        category_code: "ssd",
        image: "SSD Samsung 9100 Pro.webp"
    },
    {
        title: "SSD WD Blue SN5000",
        price: 1650000,
        description: "Cân bằng giữa hiệu năng và giá thành.",
        category_code: "ssd",
        image: "SSD WD Blue SN5000.webp"
    },
    {
        title: "SSD WD SN850X 1TB Black NVMe",
        price: 2500000,
        description: "Dòng Black cao cấp chuyên game, load map cực nhanh.",
        category_code: "ssd",
        image: "SSD WD SN850X 1TB Black NVMe.webp"
    },
    {
        title: "SSD WD SN3000 1TB",
        price: 950000,
        description: "Dòng Green giá rẻ, tiết kiệm điện năng.",
        category_code: "ssd",
        image: "SSD WD SN3000 1TB.webp"
    },

    // === 5. CPU (Vi xử lý) ===
    {
        title: "CPU AMD Ryzen 5 7600",
        price: 5200000,
        description: "6 nhân 12 luồng, hiệu năng gaming xuất sắc tầm trung.",
        category_code: "cpu",
        image: "CPU AMD Ryzen 5 7600.webp"
    },
    {
        title: "CPU AMD Ryzen 9 7950X",
        price: 13500000,
        description: "16 nhân 32 luồng, trùm render và đa nhiệm.",
        category_code: "cpu",
        image: "CPU AMD Ryzen 9 7950X.webp"
    },
    {
        title: "CPU Intel Core i3 12100F",
        price: 2100000,
        description: "Ngon bổ rẻ, 4 nhân 8 luồng, cân tốt các game cơ bản.",
        category_code: "cpu",
        image: "CPU Intel Core i3 12100F.webp"
    },
    {
        title: "CPU Intel Core i5 13600K",
        price: 7800000,
        description: "14 nhân 20 luồng, best seller cho gaming PC.",
        category_code: "cpu",
        image: "CPU Intel Core i5 13600K.webp"
    },
    {
        title: "CPU Intel Core i9 14900K",
        price: 15900000,
        description: "Quái vật hiệu năng, xung nhịp lên tới 6.0GHz.",
        category_code: "cpu",
        image: "CPU Intel Core i9 14900K.webp"
    }
  ];

  // Chuẩn bị dữ liệu để insert
  const insertData = products.map(p => {
    return {
      title: p.title,
      price: p.price,
      description: p.description,
      // Thêm đường dẫn vào trước tên file
      image: `/imgs/${p.image}`, 
      // Lấy brand từ chữ đầu tiên
      brand: p.title.split(' ')[0], 
      category_id: getCatId(p.category_code),
      stock: Math.floor(Math.random() * 50) + 1 
    };
  });

  await knex('products').insert(insertData);
  console.log('✅ Đã cập nhật database thành công với 25 sản phẩm!');
};