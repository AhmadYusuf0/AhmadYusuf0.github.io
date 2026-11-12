(() => {
  const picker = document.getElementById('portfolio-language');
  const summary = picker.querySelector('summary');
  const options = picker.querySelectorAll('[data-language]');
  const translations = {
    Home: 'Beranda', About: 'Tentang', Services: 'Layanan', Portfolio: 'Portofolio', Contact: 'Kontak',
    'I am Ahmad Yusuf Bahtiar': 'Saya Ahmad Yusuf Bahtiar',
    'Name:': 'Nama:', 'Profile:': 'Profil:', Skills: 'Keahlian',
    'Full Stack Developer': 'Pengembang Full Stack', 'About me': 'Tentang saya',
    'I am a software developer, specialising in the app mobile and web development.': 'Saya pengembang perangkat lunak yang berfokus pada aplikasi seluler dan web.',
    "Through my portfolio, you'll see examples of my work in mobile and web development, including responsive design, user interface design, and fullstack development. I have experience working with a variety of clients, and I always strive to deliver the best solutions that meet their needs.": 'Portofolio ini menampilkan pekerjaan saya dalam pengembangan aplikasi seluler dan web, termasuk desain responsif, antarmuka pengguna, dan pengembangan full stack. Saya berpengalaman bekerja dengan berbagai klien dan berupaya memberikan solusi yang sesuai dengan kebutuhan mereka.',
    "I hope that my portfolio inspires you and demonstrates my passion for programming. Thank you for your time, and please don't hesitate to contact me if you have any questions or would like to discuss a potential project.": 'Semoga portofolio ini menunjukkan minat saya pada pemrograman. Terima kasih atas waktunya. Silakan hubungi saya untuk bertanya atau membahas proyek.',
    Resume: 'Riwayat Hidup', Summary: 'Ringkasan', Education: 'Pendidikan',
    'Thank you for taking the time to view my web portfolio.': 'Terima kasih sudah meluangkan waktu untuk melihat portofolio saya.',
    "My portfolio showcases my skills and experience as a programmer, and I'm excited to share it with you. I have designed and developed a variety of projects that demonstrate my expertise in programming languages, frameworks, and tools.": 'Portofolio ini menampilkan keahlian dan pengalaman saya sebagai pemrogram melalui berbagai proyek yang saya rancang dan kembangkan.',
    'Bachelor Degree (S-1) of Technical Information': 'Sarjana (S-1) Teknik Informatika',
    'PGRI University, Yogyakarta': 'Universitas PGRI Yogyakarta',
    'Vocational High School - Mechanical Engineering': 'Sekolah Menengah Kejuruan – Teknik Mesin',
    'Professional Experience': 'Pengalaman Kerja', 'Backend Developer': 'Pengembang Backend',
    'fullstack Developer': 'Pengembang Full Stack', 'Dec 2023 - Present': 'Des 2023 – Sekarang',
    'June 2022 - Dec 2023': 'Jun 2022 – Des 2023',
    'Developing a web for system admin and web landing pages with Laravel for the back end': 'Mengembangkan panel admin dan halaman landing dengan Laravel untuk backend.',
    'Create Android and iOS mobile apps with Cordova.': 'Membuat aplikasi Android dan iOS dengan Cordova.',
    'Developing a web for system admin and web landing pages with CodeIghniter for the back end': 'Mengembangkan panel admin dan halaman landing dengan CodeIgniter untuk backend.',
    'Mobile Developer': 'Pengembang Aplikasi Seluler',
    'Graphic Designer': 'Desainer Grafis',
    'create a website appearance and develop according to client request..': 'Merancang dan mengembangkan situs web sesuai kebutuhan klien.',
    'Create a mobile application layout and application system according to the requested design flow': 'Merancang tampilan dan membangun aplikasi seluler sesuai alur yang diminta.',
    'Design and create visually appealing graphics and layouts for digital and print media, ensuring alignment with the requested design flow and brand guidelines.': 'Merancang grafis dan tata letak untuk media digital dan cetak sesuai alur desain dan panduan merek.',
    All: 'Semua', App: 'Aplikasi', Design: 'Desain',
    'Sinarmas Land Queue System': 'Sistem Antrean Sinarmas Land',
    'Brochure Warung Penyetan Mas Tri': 'Brosur Warung Penyetan Mas Tri',
    'Elegant & Unique: Wedding Invitation': 'Elegan & Unik: Undangan Pernikahan',
    'Ceo & Founder of Warung Penyetan Mas Tri': 'CEO & Pendiri Warung Penyetan Mas Tri',
    'Marketing for Goa Pindul Jogja': 'Pemasaran Goa Pindul Jogja',
    'The brochure design is excellent! 👍': 'Desain brosurnya mantap sekali! 👍',
    'Fantastic work! 🤟': 'Joss, mantap! 🤟',
    'Send me a messages and I will get back to you as soon as possible!': 'Kirim pesan dan saya akan segera membalasnya!',
    'Your Name': 'Nama Anda', 'Your Whatsapp Number': 'Nomor WhatsApp Anda',
    Subject: 'Subjek', Message: 'Pesan', 'Send Message': 'Kirim Pesan',
    Copyright: 'Hak Cipta', 'All Rights Reserved': 'Hak cipta dilindungi.', 'Created by': 'Dibuat oleh'
  };
  const projectDescriptions = [
    'Aplikasi admin sistem antrean untuk mengelola interaksi layanan pelanggan.',
    'Situs pemasaran yang menampilkan keindahan alam dan daya tarik Goa Pindul di Gunungkidul, Yogyakarta.',
    'Brosur Warung Penyetan Mas Tri yang menampilkan menu dan suasana warung.',
    'Undangan untuk momen istimewa dengan gaya modern dan sentuhan pribadi.',
    'Situs pemasaran yang menampilkan keindahan alam dan daya tarik Gua Pindul di Gunungkidul, Yogyakarta.',
    'Yogyakarta Craft memproduksi perlengkapan rumah tangga dari kayu, seperti talenan, sendok, dan dekorasi, dengan bahan berkelanjutan dan teknik tradisional.',
    'Mitra Teknik Yasatama menawarkan produk dan layanan pengecoran logam dengan standar kualitas dan presisi tinggi.',
    'Aplikasi web untuk mengelola administrasi dan keuangan Syaira Global School. Staf sekolah dapat mengelola data siswa, guru, kelas, dan tahun ajaran, serta mencatat tagihan, pembayaran, tabungan siswa, dan pengeluaran sekolah. Dashboard merangkum aktivitas sekolah, sementara laporan membantu staf meninjau transaksi.',
    'Website wisata yang menampilkan paket cave tubing, rafting, dan aktivitas sekitar Goa Pindul, dengan pemesanan melalui WhatsApp.',
    'Website yang memperkenalkan layanan penyewaan sound system dan produksi acara Aero Production.',
    'Website korporat Saratoga yang menampilkan informasi perusahaan, laporan, dan publikasi investor. Saya mengerjakan bagian CMS dan API.',
    'Website Kimaya Hotels untuk memperkenalkan properti hotel kepada calon tamu. Saya mengerjakan bagian CMS dan API.'
  ];
  const entries = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, #portfolio-language')) continue;
    const key = node.data.trim().replace(/\s+/g, ' ');
    if (Object.hasOwn(translations, key)) {
      entries.push([node, node.data, node.data.replace(node.data.trim(), translations[key])]);
    }
  }
  const descriptions = [...document.querySelectorAll('.portfolio-info p')].map((element, index) =>
    [element, [...element.childNodes], projectDescriptions[index]]);
  const placeholders = [...document.querySelectorAll('#contactForm [placeholder]')].map((element) =>
    [element, element.placeholder, translations[element.placeholder]]);

  function updateCard(button) {
    const open = button.getAttribute('aria-expanded') === 'true';
    const indonesian = document.documentElement.lang === 'id';
    button.textContent = indonesian ? (open ? 'Tutup proyek' : 'Buka proyek') : (open ? 'Close project' : 'Open project');
  }

  function updateExperience(indonesian) {
    const experience = document.getElementById('development-experience');
    const [startYear, startMonth] = experience.dataset.start.split('-').map(Number);
    const now = new Date();
    const months = (now.getFullYear() - startYear) * 12 + now.getMonth() + 1 - startMonth;
    const years = Math.floor(months / 12);
    const duration = indonesian ? `${years} tahun` : `${years} ${years === 1 ? 'year' : 'years'}`;
    experience.textContent = indonesian
      ? `Selama ${duration} terakhir, saya mengembangkan web dan aplikasi seluler dengan JavaScript, CSS, HTML, dan PHP.`
      : `For the last ${duration}, I have been developing web and mobile applications using JavaScript, CSS, HTML, and PHP.`;
  }

  function updateLanguage(language) {
    const indonesian = language === 'id';
    document.documentElement.lang = language;
    document.title = indonesian ? 'Yusuf - Portofolio' : 'Yusuf - Portfolio';
    summary.setAttribute('aria-label', indonesian ? 'Bahasa: Indonesia' : 'Language: English');
    summary.querySelector('.language-code').textContent = language.toUpperCase();
    options.forEach((option) => option.setAttribute('aria-pressed', String(option.dataset.language === language)));
    entries.forEach(([node, english, translation]) => { node.data = indonesian ? translation : english; });
    descriptions.forEach(([element, english, translation]) => {
      element.replaceChildren(...(indonesian ? [translation] : english));
    });
    placeholders.forEach(([element, english, translation]) => {
      element.placeholder = indonesian ? translation : english;
    });
    document.querySelectorAll('.portfolio-cover-toggle').forEach(updateCard);
    updateExperience(indonesian);
    document.dispatchEvent(new Event('portfolio:language-change'));
  }

  updateExperience(false);
  options.forEach((option) => option.addEventListener('click', () => {
    if (document.documentElement.lang !== option.dataset.language) updateLanguage(option.dataset.language);
    picker.open = false;
    summary.focus();
  }));
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && picker.open) {
      picker.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!picker.contains(event.target)) picker.open = false;
  });
  document.addEventListener('portfolio:card-toggle', (event) => updateCard(event.target));
})();
