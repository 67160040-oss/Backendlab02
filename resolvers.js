let students = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    major: "วิทยาการคอมพิวเตอร์",
    email: "somchai@example.com",
    phone: "080-000-0001",
    courseIds: [101, 102],
  },
  {
    id: 2,
    name: "สมหญิงญิ รักเรียรีน",
    major: "เทคโนโลยีสารสนเทศ",
    email: "somying@example.com",
    phone: "080-000-0002",
    courseIds: [102],
  },
];
let courses = [
  { id: 101, courseName: "การเขียขีนโปรแกรมเบื้อบื้ งต้นต้ ", credit: 3 },
  { id: 102, courseName: "โครงสร้าร้งข้อข้มูลมู ", credit: 3 },
];
let nextStudentId = 3;
function resolveStudent(student) {
  return {
    ...student,
    courses: courses.filter((c) => student.courseIds.includes(c.id)),
  };
}
const root = {
  // ----- Read -----
  student: ({ id }) => {
    const student = students.find((s) => s.id === Number(id));
    return student ? resolveStudent(student) : null;
  },
  students: ({ major, sortBy }) => {
    let result = students;
    if (major) {
      result = result.filter((s) => s.major === major);
    }
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result.map(resolveStudent);
  },
  studentCount: () => students.length,
  course: ({ id }) => courses.find((c) => c.id === Number(id)) || null,
  courses: ({ minCredit }) => {
    if (minCredit === undefined || minCredit === null) {
      return courses;
    }
    return courses.filter((c) => c.credit >= minCredit);
  },
  searchStudents: ({ keyword }) => {
    const lowerKeyword = keyword.toLowerCase();
    return students
      .filter(
        (s) =>
          s.name.toLowerCase().includes(lowerKeyword) ||
          s.major.toLowerCase().includes(lowerKeyword),
      )
      .map(resolveStudent);
  },
  // ----- Create -----
  createStudent: ({ input }) => {
    const newStudent = {
      id: nextStudentId++,
      name: input.name,
      major: input.major,
      email: input.email,
      phone: input.phone,
      courseIds: (input.courseIds || []).map(Number),
    };
    students.push(newStudent);
    return resolveStudent(newStudent);
  },
  // ----- Update -----
  updateStudent: ({ id, input }) => {
    const student = students.find((s) => s.id === Number(id));
    if (!student) {
      return null;
    }
    if (input.name !== undefined) student.name = input.name;
    if (input.major !== undefined) student.major = input.major;
    if (input.email !== undefined) student.email = input.email;
    if (input.phone !== undefined) student.phone = input.phone;
    if (input.courseIds !== undefined) {
      student.courseIds = input.courseIds.map(Number);
    }
    return resolveStudent(student);
  },
  // ----- Delete -----
  deleteStudent: ({ id }) => {
    const index = students.findIndex((s) => s.id === Number(id));
    if (index === -1) {
      return {
        success: false,
        message: "ไม่พบม่ ข้อข้มูลมู นักศึกศึษาที่ต้ที่ อต้ งการลบ",
      };
    }
    students.splice(index, 1);
    return { success: true, message: "ลบข้อข้มูลมู นักศึกศึษาสำ เร็จ" };
  },
};
module.exports = root;
