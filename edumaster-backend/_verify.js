"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const p = new client_1.PrismaClient();
(async () => {
    const enroll = await p.courseEnrollment.count();
    const certs = await p.certificate.count();
    const ds = await p.user.findUnique({ where: { email: "student@edumaster.africa" }, include: { courses: true, certificates: true } });
    console.log(JSON.stringify({ enroll, certs, demoStudentEnroll: ds?.courses.length, demoStudentCerts: ds?.certificates.length }, null, 2));
    await p.$disconnect();
})();
//# sourceMappingURL=_verify.js.map