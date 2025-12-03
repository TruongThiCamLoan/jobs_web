const db = require('../models');
const {
    Student, Employer, User, Education, Language, Experience,
    Reference, Skill, DesiredIndustry, PreferredLocation
} = db;

// Helper: tìm hoặc tạo student
const findOrCreateStudent = async (userId, t = null) => {
    return await Student.findOrCreate({
        where: { userId },
        defaults: { userId },
        transaction: t
    });
};

// =======================================================
// 1. LẤY TOÀN BỘ HỒ SƠ (GET /api/profile) – ĐÃ SỬA HOÀN HẢO
// =======================================================
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.userRole;

        if (userRole === 'Student') {
            const profile = await Student.findOne({
                where: { userId },
                // Không dùng attributes exclude → trả về tất cả field quan trọng
                include: [
                    { model: User, as: 'user', attributes: ['email', 'fullName'] },
                    { model: Education, as: 'education' },
                    { model: Language, as: 'languages' },
                    { model: Experience, as: 'experiences' },
                    { model: Reference, as: 'references' },
                    { model: Skill, as: 'skills' },
                    { model: DesiredIndustry, as: 'desiredIndustries', attributes: ['industryName'] },
                    { model: PreferredLocation, as: 'preferredLocations', attributes: ['locationName'] },
                ]
            });

            if (!profile) {
                return res.status(404).json({ message: "Không tìm thấy hồ sơ sinh viên." });
            }

            const data = profile.toJSON();

            res.status(200).json({
                // Các field Step 1 & 2
                resumeTitle: data.resumeTitle || "",
                fullName: data.fullName || data.user?.fullName || "",
                nationality: data.nationality || "",
                dateOfBirth: data.dateOfBirth || "",
                maritalStatus: data.maritalStatus || "",
                gender: data.gender || "",
                avatarUrl: data.avatarUrl || "",
                phone: data.phone || "",
                email: data.email || data.user?.email || "",
                country: data.country || "Việt Nam",
                province: data.province || "",
                district: data.district || "",
                address: data.address || "",

                // Các field khác
                desiredPosition: data.desiredPosition || "",
                recentSalary: data.recentSalary || null,
                recentCurrency: data.recentCurrency || "VND",
                desiredSalaryFrom: data.desiredSalaryFrom || null,
                desiredSalaryTo: data.desiredSalaryTo || null,
                desiredCurrency: data.desiredCurrency || "VND",
                jobType: data.jobType || "",
                jobLevel: data.jobLevel || "",
                careerGoal: data.careerGoal || "",
                totalYearsExperience: data.totalYearsExperience || 0,
                isSearchable: data.isSearchable || false,
                isComplete: data.isComplete || false,
                profileStatus: data.profileStatus || "draft",

                // Mảng quan hệ
                education: data.education || [],
                languages: data.languages || [],
                experiences: data.experiences || [],
                references: data.references || [],
                skills: data.skills || [],
                desiredIndustries: data.desiredIndustries?.map(i => i.industryName) || [],
                preferredLocations: data.preferredLocations?.map(l => l.locationName) || [],
            });

        } else if (userRole === 'Employer') {
            const profile = await Employer.findOne({
                where: { userId },
                include: [{ model: User, as: 'user', attributes: ['email', 'fullName'] }]
            });
            if (!profile) return res.status(404).json({ message: "Không tìm thấy hồ sơ nhà tuyển dụng." });
            res.json(profile.toJSON());
        } else {
            return res.status(403).json({ message: "Vai trò không hợp lệ." });
        }
    } catch (error) {
        console.error("Lỗi lấy profile:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// =======================================================
// 2. BƯỚC 1 & 2: Thông tin cá nhân + Liên hệ
// =======================================================
exports.createOrUpdateProfileStep1And2 = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            resumeTitle, fullName, nationality, dateOfBirth, maritalStatus, gender, avatarUrl,
            phone, email, country, province, district, address
        } = req.body;

        const [student] = await findOrCreateStudent(userId);

        await student.update({
            resumeTitle, fullName, nationality, dateOfBirth,
            maritalStatus, gender, avatarUrl,
            phone, email, country, province, district, address
        });

        // Đồng bộ fullName & email vào bảng users
        if (fullName || email) {
            await User.update(
                { fullName, email },
                { where: { id: userId } }
            );
        }

        res.json({ message: "Cập nhật thông tin cá nhân & liên hệ thành công!" });
    } catch (error) {
        console.error("Lỗi Step 1&2:", error);
        res.status(500).json({ message: "Lỗi lưu thông tin cá nhân.", error: error.message });
    }
};

// =======================================================
// 3. BƯỚC 3: Học vấn
// =======================================================
exports.updateEducation = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const { educationEntries = [] } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        await Education.destroy({ where: { studentId }, transaction: t });

        if (educationEntries.length > 0) {
            await Education.bulkCreate(
                educationEntries.map(e => ({ studentId, ...e })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật học vấn thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi học vấn", error: error.message });
    }
};

// =======================================================
// 4. BƯỚC 4: Ngoại ngữ
// =======================================================
exports.updateLanguages = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const { languageEntries = [] } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        await Language.destroy({ where: { studentId }, transaction: t });

        if (languageEntries.length > 0) {
            await Language.bulkCreate(
                languageEntries.map(l => ({ studentId, ...l })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật ngoại ngữ thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi ngoại ngữ", error: error.message });
    }
};

// =======================================================
// 5. BƯỚC 5: Kinh nghiệm làm việc
// =======================================================
exports.updateExperiences = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const { totalYearsExperience, experienceEntries = [] } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        // Cập nhật tổng năm kinh nghiệm
        if (totalYearsExperience !== undefined) {
            await student.update({ totalYearsExperience }, { transaction: t });
        }

        await Experience.destroy({ where: { studentId }, transaction: t });

        if (experienceEntries.length > 0) {
            await Experience.bulkCreate(
                experienceEntries.map(e => ({ studentId, ...e })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật kinh nghiệm làm việc thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi kinh nghiệm", error: error.message });
    }
};

// =======================================================
// 6. BƯỚC 6: Người tham khảo
// =======================================================
exports.updateReferences = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const { referenceEntries = [] } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        await Reference.destroy({ where: { studentId }, transaction: t });

        if (referenceEntries.length > 0) {
            await Reference.bulkCreate(
                referenceEntries.map(r => ({ studentId, ...r })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật người tham khảo thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi người tham khảo", error: error.message });
    }
};

// =======================================================
// 7. BƯỚC 7: Kỹ năng
// =======================================================
exports.updateSkills = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const { skillEntries = [] } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        await Skill.destroy({ where: { studentId }, transaction: t });

        if (skillEntries.length > 0) {
            await Skill.bulkCreate(
                skillEntries.map(s => ({ studentId, ...s })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật kỹ năng thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi kỹ năng", error: error.message });
    }
};

// =======================================================
// 8. BƯỚC 8: Mục tiêu nghề nghiệp
// =======================================================
exports.updateCareerGoal = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.userId;
        const {
            desiredPosition, recentSalary, recentCurrency, desiredSalaryFrom, desiredSalaryTo,
            desiredCurrency, jobType, jobLevel, careerGoal,
            desiredIndustries = [], preferredLocations = []
        } = req.body;

        const [student] = await findOrCreateStudent(userId, t);
        const studentId = student.studentId;

        // Cập nhật bảng Student
        await student.update({
            desiredPosition, recentSalary, recentCurrency,
            desiredSalaryFrom, desiredSalaryTo, desiredCurrency,
            jobType, jobLevel, careerGoal
        }, { transaction: t });

        // Xóa & tạo mới ngành nghề mong muốn
        await DesiredIndustry.destroy({ where: { studentId }, transaction: t });
        if (desiredIndustries.length > 0) {
            await DesiredIndustry.bulkCreate(
                desiredIndustries.map(name => ({ studentId, industryName: name })),
                { transaction: t }
            );
        }

        // Xóa & tạo mới địa điểm ưa thích
        await PreferredLocation.destroy({ where: { studentId }, transaction: t });
        if (preferredLocations.length > 0) {
            await PreferredLocation.bulkCreate(
                preferredLocations.map(name => ({ studentId, locationName: name })),
                { transaction: t }
            );
        }

        await t.commit();
        res.json({ message: "Cập nhật mục tiêu nghề nghiệp thành công!" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Lỗi mục tiêu nghề nghiệp", error: error.message });
    }
};

// =======================================================
// 9. BƯỚC 9: Trạng thái hồ sơ
// =======================================================
exports.updateSearchStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { isSearchable, isComplete, profileStatus } = req.body;

        const [student] = await findOrCreateStudent(userId);

        await student.update({
            isSearchable: isSearchable ?? student.isSearchable,
            isComplete: isComplete ?? student.isComplete,
            profileStatus: profileStatus || student.profileStatus,
        });

        res.json({ message: "Cập nhật trạng thái hồ sơ thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi trạng thái hồ sơ", error: error.message });
    }
};