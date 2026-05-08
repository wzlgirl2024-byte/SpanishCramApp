import { courseData } from './src/data/course_data.js';

console.log("Checking Course Data...");
console.log(`Total Lessons: ${courseData.length}`);
courseData.forEach(lesson => {
    console.log(`ID: ${lesson.id}, Title: ${lesson.title}`);
});
