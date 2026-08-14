import type { Profile, Project, Experience, Skill } from "../types";

export const profileData: Profile = {
    name: "Nguyen Duc Thinh",
    title: "Full-Stack Web Developer",
    titleVi: "Lập Trình Viên Web Full-Stack",
    tagline: '"Opportunities don\'t happen, you create them."',
    taglineVi: '"Cơ hội không tự đến, bạn phải tự tạo ra chúng."',
    bio: "I am an open-minded full-stack developer with over two years of experience in both front-end and back-end development. I adapt quickly to new environments, enjoy solving challenges, and continuously improve my technical and problem-solving skills, with a long-term interest in product and project-oriented roles.",
    bioVi: "Tôi là một lập trình viên full-stack năng động với hơn hai năm kinh nghiệm phát triển cả front-end và back-end. Tôi thích nghi nhanh với môi trường mới, thích giải quyết thử thách và không ngừng cải thiện kỹ năng kỹ thuật, với định hướng dài hạn trong các vai trò quản lý sản phẩm và dự án.",
    email: "ducthnh2411@gmail.com",
    phone: "0935098021",
    location: "District 7, Ho Chi Minh City",
    locationVi: "Quận 7, Thành phố Hồ Chí Minh",
    github: "https://github.com/Th1nh2411",
    birthday: "24/11/2001",
};

export const projectsData: Project[] = [
    {
        id: "car-rent-system",
        title: "Car Rent System",
        titleVi: "Hệ Thống Thuê Xe",
        description:
            "A full rental lifecycle management system handling contract creation, customer management, monthly billing, auto payment processing, and settlement tracking.",
        descriptionVi:
            "Hệ thống quản lý vòng đời thuê xe toàn diện, xử lý tạo hợp đồng, quản lý khách hàng, thanh toán hàng tháng tự động và theo dõi quyết toán.",
        detailDescriptions: [],
        detailDescriptionsVi: [],
        images: [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        ],
        techStack: ["ReactJS", "NestJS", "MySQL", "CMS", "Virtual Account API"],
        period: "12/2023 – Present",
        featured: true,
        details:
            "The system handles the full rental lifecycle, from contract creation and customer management to monthly billing, auto payment processing, and settlement tracking. Uses CMS for auto monthly payment and virtual account payment.",
        detailsVi:
            "Hệ thống xử lý toàn bộ vòng đời thuê xe, từ tạo hợp đồng và quản lý khách hàng đến thanh toán hàng tháng, xử lý thanh toán tự động và theo dõi quyết toán. Sử dụng CMS cho thanh toán tháng tự động và thanh toán qua tài khoản ảo.",
        responsibilities: [
            "Built complex UI/UX components based on Figma designs",
            "Implemented automated payment processes",
            "Integrated third-party APIs for payment functionalities including automatic monthly deductions and virtual account payments",
            "Managed backend tasks including CRUD operations, contract lifecycle management, payment storage system",
        ],
        responsibilitiesVi: [
            "Xây dựng các thành phần UI/UX phức tạp dựa trên thiết kế Figma",
            "Triển khai quy trình thanh toán tự động",
            "Tích hợp API bên thứ ba cho chức năng thanh toán bao gồm khấu trừ hàng tháng tự động và thanh toán tài khoản ảo",
            "Quản lý các tác vụ backend bao gồm CRUD, quản lý vòng đời hợp đồng, hệ thống lưu trữ thanh toán",
        ],
    },
    {
        id: "702prime",
        title: "702Prime – Used Car Platform",
        titleVi: "702Prime – Nền Tảng Xe Cũ",
        description:
            "A certified used car platform operated by Kolon Mobility Group, providing high-quality inspected vehicles with browsing, detailed info, and consultation requests.",
        descriptionVi:
            "Nền tảng xe cũ được chứng nhận vận hành bởi Kolon Mobility Group, cung cấp xe đã qua kiểm tra chất lượng cao với tính năng duyệt danh sách, xem thông tin chi tiết và yêu cầu tư vấn.",
        detailDescriptions: [],
        detailDescriptionsVi: [],
        images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
        ],
        techStack: ["ReactJS", "NestJS", "MySQL", "Figma"],
        liveUrl: "https://702prime.com",
        period: "12/2023 – Present",
        featured: true,
        details:
            "A certified used car platform operated by Kolon Mobility Group. Users can browse car listings, view detailed vehicle information, and request consultations through a modern interface.",
        responsibilities: [
            "Joined core UI/UX build based on Figma designs",
            "Implemented buy/rent workflows and integrated with service modules like the rent system",
        ],
    },
    {
        id: "booking-tour",
        title: "Holidate - Tour Booking Website",
        titleVi: "Website Đặt Tour Du Lịch",
        description:
            "A full-featured tour booking platform with user authentication, tour details, payment, booking history, live chat, and an admin panel for managing tours and bookings.",
        descriptionVi:
            "Nền tảng đặt tour du lịch đầy đủ tính năng với xác thực người dùng, chi tiết tour, thanh toán, lịch sử đặt tour, trò chuyện trực tiếp và bảng quản trị để quản lý tour và đặt chỗ.",
        detailDescriptions: [],
        detailDescriptionsVi: [],
        images: [
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        ],
        techStack: ["ReactJS", "ExpressJS", "MongoDB", "Socket.io"],
        liveUrl: "https://holidate.vercel.app",
        githubUrl: "https://github.com/Th1nh2411",
        period: "05/2023 – 06/2023",
        featured: true,
        details:
            "User accounts can view tour details, book tours, make payments, change profiles and passwords, view booking history, and chat. Admin accounts can manage tour info, guide info, bookings, user feedback, and support clients through a chat box.",
    },
];

export const experienceData: Experience[] = [
    {
        id: "hanbiro",
        company: "Hanbiro Viet Nam Co., Ltd – Hanbirosoft",
        role: "Web Developer & Team Leader",
        roleVi: "Lập Trình Viên Web & Trưởng Nhóm",
        period: "12/2023 – Present",
        type: "fulltime",
        descriptions: [
            "Lead a group of developers working on multiple projects.",
            "Checked technical needs, set up sprint tasks, and tracked project progress.",
            "Worked on both UI and server-side features, connecting systems with outside services.",
            "Handled server setup and deployment workflows.",
        ],
        descriptionsVi: [
            "Dẫn dắt nhóm lập trình viên làm việc trên nhiều dự án.",
            "Kiểm tra yêu cầu kỹ thuật, thiết lập nhiệm vụ sprint và theo dõi tiến độ dự án.",
            "Làm việc cả UI và phía server, kết nối hệ thống với dịch vụ bên ngoài.",
            "Xử lý thiết lập và triển khai server.",
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
            "Participated in small projects by building reusable components and integrating backend APIs.",
        ],
        descriptionsVi: [
            "Học các kỹ thuật ReactJS nâng cao bao gồm sử dụng và tùy chỉnh thư viện component.",
            "Tham gia các dự án nhỏ bằng cách xây dựng các component tái sử dụng và tích hợp API backend.",
        ],
    },
];

export const skillsData: Skill[] = [
    {
        category: "Frontend",
        categoryVi: "Frontend",
        items: ["ReactJS", "Next.js", "AngularJS", "TypeScript", "TailwindCSS"],
    },
    {
        category: "Backend",
        categoryVi: "Backend",
        items: ["NestJS", "ExpressJS", "Node.js", "REST API"],
    },
    {
        category: "Databases",
        categoryVi: "Cơ sở dữ liệu",
        items: ["MySQL", "MariaDB", "MongoDB", "Firebase"],
    },
    {
        category: "DevOps & Server",
        categoryVi: "DevOps & Server",
        items: ["Linux Server", "Apache", "Docker", "Firebase Hosting"],
    },
    {
        category: "Tools & Others",
        categoryVi: "Công cụ & Khác",
        items: ["Git", "Postman", "Figma", "Jira"],
    },
];
