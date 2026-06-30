import Course from "../models/courseModel.js"

//API to get All Courses



export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select("-courseContent").populate({ path: 'educator' })

    console.log(`Fetched ${courses.length} courses from DB`);
    res.json({ success: true, courses })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// APi To Get Course by Id

export const getCourseId = async (req, res) => {
  const { id } = req.params
  try {
    const courseData = await Course.findById(id).populate({ path: 'educator' })

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // remove lecture Url when is preview is fales
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      })
    })

    res.json({ success: true, courseData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}