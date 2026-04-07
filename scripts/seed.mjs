// scripts/seed.mjs
// Run: node scripts/seed.mjs
// Make sure to set your Firebase credentials in .env first

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";
import { config } from "dotenv";
config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Profile ---
await setDoc(doc(db, "portfolio", "profile"), {
    name: "Nguyen Duc Thinh",
    title: "Full-Stack Web Developer",
    titleVi: "Lập Trình Viên Web Full-Stack",
    tagline: '"Opportunities don\'t happen, you create them."',
    taglineVi: '"Cơ hội không tự đến, bạn phải tự tạo ra chúng."',
    bio: "I am an open-minded full-stack developer with over two years of experience in both front-end and back-end development.",
    bioVi: "Tôi là một lập trình viên full-stack năng động với hơn hai năm kinh nghiệm phát triển cả front-end và back-end.",
    email: "ducthnh2411@gmail.com",
    phone: "0935098021",
    location: "District 7, Ho Chi Minh City",
    locationVi: "Quận 7, Thành phố Hồ Chí Minh",
    github: "https://github.com/Th1nh2411",
    birthday: "24/11/2001",
});
console.log("✓ Profile seeded");

// --- Projects ---
const projects = [
    {
        id: "car-rent-system",
        title: "Car Rent System",
        titleVi: "Hệ Thống Thuê Xe",
        description: "A full rental lifecycle management system.",
        detailDescriptions: [
            "The system handles the full rental lifecycle, from contract creation and customer management to monthly billing, auto payment processing, and settlement tracking. Use CMS for auto monthly payment and virtual account payment.",
            "Built complex UI/UX components based on Figma designs.",
            "Implemented automated payment processes.",
            "Integrated third-party APIs for payment functionalities, including automatic monthly deductions and virtual account payments.",
            "Managed backend tasks, including CRUD operations, contract lifecycle management, payment storage system."
        ],
        detailDescriptionsVi: [
            "Hệ thống xử lý toàn bộ vòng đời thuê xe, từ tạo hợp đồng, quản lý khách hàng đến lập hóa đơn hàng tháng, xử lý thanh toán tự động và theo dõi đối soát. Sử dụng CMS cho thanh toán tự động hàng tháng và thanh toán qua tài khoản ảo.",
            "Xây dựng các thành phần UI/UX phức tạp dựa trên thiết kế từ Figma.",
            "Triển khai các quy trình thanh toán tự động.",
            "Tích hợp API bên thứ ba cho các chức năng thanh toán, bao gồm khấu trừ tự động hàng tháng và thanh toán qua tài khoản ảo.",
            "Quản lý các tác vụ backend, bao gồm CRUD, quản lý vòng đời hợp đồng, và hệ thống lưu trữ thanh toán."
        ],
        images: [
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775530990/rent_1_sullce.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775530990/rent_2_a33rki.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775530990/rent_3_fy93xo.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775530990/rent_4_gkz8hg.png",
        ],
        techStack: ["ReactJS", "NestJS", "MySQL"],
        period: "12/2023 – Present",
        featured: true,
    },
    {
        id: "702prime",
        title: "702Prime – Used Car Platform",
        description: "A certified used car platform by Kolon Mobility Group.",
        detailDescriptions: [
            "A certified used car platform operated by Kolon Mobility Group, offering high-quality inspected vehicles. The website enables users to browse listings, view detailed vehicle information, and request consultations through a modern, user-friendly interface.",
            "Contributed to building core UI/UX components based on Figma designs.",
            "Implemented buy and rent workflows, integrating them with service modules such as the rental system."
        ],
        detailDescriptionsVi: [
            "Nền tảng xe đã qua sử dụng được chứng nhận do Kolon Mobility Group vận hành, cung cấp các phương tiện chất lượng cao đã được kiểm định. Website cho phép người dùng duyệt danh sách xe, xem thông tin chi tiết và gửi yêu cầu tư vấn thông qua giao diện hiện đại, thân thiện.",
            "Tham gia xây dựng UI/UX cốt lõi dựa trên thiết kế Figma.",
            "Triển khai các luồng mua/thuê xe và tích hợp với các module dịch vụ như hệ thống thuê xe."
        ],
        images: [
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775529895/702-1_z9plg6.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775529896/702-2_kaezgx.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775529895/702-3_umipkv.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775529895/702-4_e2w8bk.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775529894/702-5_chdkut.png",
        ],
        techStack: ["ReactJS", "NestJS", "MySQL"],
        liveUrl: "https://702prime.com",
        period: "12/2023 – Present",
        featured: true,
    },
    {
        id: "booking-tour",
        title: "Booking Tour Website",
        description: "Full-featured tour booking platform.",
        detailDescriptions: [
            "When logging in as a user, you can view tour details, book tours, make payments, update your profile, change your password, view booking history, and chat.",
            "When logging in as an admin, you can manage tour information, guide information, bookings, user feedback, and support clients through the chat box."
        ],
        detailDescriptionsVi: [
            "Khi đăng nhập với tài khoản người dùng, bạn có thể xem chi tiết tour, đặt tour, thanh toán, cập nhật hồ sơ, đổi mật khẩu, xem lịch sử đặt tour và chat.",
            "Khi đăng nhập với tài khoản admin, bạn có thể quản lý thông tin tour, thông tin hướng dẫn viên, đơn đặt tour, phản hồi của người dùng và hỗ trợ khách hàng qua chat."
        ],
        images: [
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_1.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_1_2.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_2.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_3.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_4.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_5.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_6.png",
            "https://res.cloudinary.com/dgsumh8ih/image/upload/v1775528439/holidate_preview_7.png"
        ],
        techStack: ["ReactJS", "ExpressJS", "MongoDB"],
        liveUrl: "https://holidate.vercel.app",
        githubUrl: "https://github.com/Th1nh2411",
        period: "05/2023 – 06/2023",
        featured: true,
    },
];

for (const project of projects) {
    const { id, ...data } = project;
    await setDoc(doc(db, "projects", id), data);
}
console.log("✓ Projects seeded");

// --- Experience ---
// ID cố định = tên công ty slug → chạy lại sẽ replace thay vì tạo mới
const experience = [
    {
        id: "hanbiro",
        company: "Hanbiro Viet Nam Co., Ltd",
        role: "Web Developer & Team Leader",
        roleVi: "Lập Trình Viên Web & Trưởng Nhóm",
        period: "12/2023 – Present",
        type: "fulltime",
        descriptions: [
            "Lead a group of developers working on multiple projects (from 10/2025).",
            "Checked technical needs, set up sprint tasks, and kept track of project progress.",
            "Worked on both UI and server-side features, connecting systems with outside services."
        ],
        descriptionsVi: [
            "Dẫn dắt một nhóm developer làm việc trên nhiều dự án (từ 10/2025).",
            "Phân tích yêu cầu kỹ thuật, thiết lập sprint tasks và theo dõi tiến độ dự án.",
            "Phát triển cả phía giao diện (UI) và backend, tích hợp hệ thống với các dịch vụ bên ngoài."
        ],
    },
    {
        id: "amazing-tech",
        company: "Amazing Tech",
        role: "Frontend Intern",
        roleVi: "Thực Tập Sinh Frontend",
        period: "08/2023 – 11/2023",
        type: "intern",
        descriptions: [
            "Learned advanced ReactJS techniques including using and customizing component libraries.",
            "Participated in small projects by building reusable components and integrating backend APIs."
        ],
        descriptionsVi: [
            "Học các kỹ thuật nâng cao trong ReactJS, bao gồm việc sử dụng và tùy chỉnh các thư viện component.",
            "Tham gia các dự án nhỏ bằng cách xây dựng các component tái sử dụng và tích hợp API backend."
        ],
    },
];

for (const exp of experience) {
    const { id, ...data } = exp;
    await setDoc(doc(db, "experience", id), data);
}
console.log("✓ Experience seeded");

// --- Skills ---
// ID cố định theo tên category slug
const skills = [
    {
        id: "frontend",
        category: "Frontend",
        categoryVi: "Frontend",
        items: ["ReactJS", "Next.js", "AngularJS", "TypeScript", "TailwindCSS"],
    },
    {
        id: "backend",
        category: "Backend",
        categoryVi: "Backend",
        items: ["NestJS", "ExpressJS", "Node.js", "REST API"],
    },
    {
        id: "databases",
        category: "Databases",
        categoryVi: "Cơ sở dữ liệu",
        items: ["MySQL", "MariaDB", "MongoDB", "Firebase"],
    },
    {
        id: "devops",
        category: "DevOps & Server",
        categoryVi: "DevOps & Server",
        items: ["Linux Server", "Apache", "Docker"],
    },
    {
        id: "tools",
        category: "Tools & Others",
        categoryVi: "Công cụ & Khác",
        items: ["Git", "Postman", "Figma", "Jira"],
    },
];

for (const skill of skills) {
    const { id, ...data } = skill;
    await setDoc(doc(db, "skills", id), data);
}
console.log("✓ Skills seeded");

console.log("\n🎉 All data seeded to Firestore!");
process.exit(0);
