import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import uniqid from 'uniqid'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { assets } from '../../assets/assets';
import Loading from '../../components/loading';

const UpdateCourse = ({ course }) => {
  const { backendUrl, atoken, } = useContext(AppContext);
  const navigate = useNavigate();
  const quillReff = useRef(null);
  const editorReff = useRef(null);
  const location = useLocation();
  const { id } = useParams(); // Get course ID from URL
  const [editingLecture, setEditingLecture] = useState(null);
  const educatorCoursesFromState = location.state?.educatorCourses;
  const [educatorCourses, setEducatorCourses] = useState(educatorCoursesFromState);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(educatorCourses?.coursePrice || 0);
  const [courseMode, setCourseMode] = useState(educatorCourses?.courseMode || 'Both');
  const [coursePricePhysical, setCoursePricePhysical] = useState(educatorCourses?.coursePricePhysical || 0);
  const [coursePriceVirtual, setCoursePriceVirtual] = useState(educatorCourses?.coursePriceVirtual || 0);
  const [courseAddress, setCourseAddress] = useState(educatorCourses?.courseAddress || "");
  const [meetingUrl, setMeetingUrl] = useState(educatorCourses?.meetingUrl || "");
  const [classSchedule, setClassSchedule] = useState(educatorCourses?.classSchedule || "");
  const [courseDescription, setCourseDescription] = useState(educatorCourses?.courseDescription || "");
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreview: false,
  })

  // Fetch full course data including courseContent
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      setIsFetchingCourse(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/educator/course/${id}`,
          { headers: { atoken } }
        );

        if (data.success) {
          console.log('Fetched full course data:', data.course);
          setEducatorCourses(data.course);
        } else {
          toast.error(data.message || 'Failed to fetch course data');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course data');
      } finally {
        setIsFetchingCourse(false);
      }
    };

    // Only fetch if we don't have courseContent from state
    if (!educatorCoursesFromState?.courseContent) {
      fetchCourseData();
    }
  }, [id, backendUrl, atoken]);

  const handleChapter = async (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(chapters.map((chapter) => chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter));
    };

  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters((prevChapters) =>
        prevChapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            return {
              ...chapter,
              chapterContent: chapter.chapterContent.filter(
                (_, i) => i !== lectureIndex
              ),
            };
          }
          return chapter;
        })
      );
    }
  };


  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
      return toast.warning("Please fill all fields!");
    }

    setChapters((prevChapters) =>
      prevChapters.map((chapter) => {
        // Editing an existing lecture
        if (editingLecture && chapter.chapterId === editingLecture.chapterId) {
          const updatedContent = chapter.chapterContent.map((lec) =>
            lec.lectureId === editingLecture.lectureId
              ? { ...lec, ...lectureDetails } // Replace lecture
              : lec
          );
          return { ...chapter, chapterContent: updatedContent };
        }
        // Adding a new lecture
        if (!editingLecture && chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureId: uniqid(),
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
          };
          return { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] };
        }
        return chapter;
      })
    );

    // Reset popup
    setShowPopup(false);
    setEditingLecture(null);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreview: false,
    });
  };

  // Initialize Quill + prefill description
  useEffect(() => {
    if (!quillReff.current && editorReff.current) {
      quillReff.current = new Quill(editorReff.current, { theme: "snow" });
    }
  }, []);

  // Prefill description when educatorCourses changes
  useEffect(() => {
    console.log('educatorCourses:', educatorCourses);
    console.log('courseContent:', educatorCourses?.courseContent);

    if (educatorCourses && quillReff.current) {
      setCourseTitle(educatorCourses.courseTitle || "");
      setCoursePrice(educatorCourses.coursePrice || 0);
      setCourseMode(educatorCourses.courseMode || 'Both');
      setCoursePricePhysical(educatorCourses.coursePricePhysical || 0);
      setCoursePriceVirtual(educatorCourses.coursePriceVirtual || 0);
      setCourseAddress(educatorCourses.courseAddress || "");
      setMeetingUrl(educatorCourses.meetingUrl || "");
      setClassSchedule(educatorCourses.classSchedule || "");
      setDiscount(educatorCourses.discount || 0);

      // Ensure chapters are set correctly
      if (educatorCourses.courseContent && Array.isArray(educatorCourses.courseContent)) {
        console.log('Setting chapters:', educatorCourses.courseContent);
        setChapters(educatorCourses.courseContent);
      } else {
        console.log('No courseContent found, setting empty array');
        setChapters([]);
      }

      if (quillReff.current) {
        quillReff.current.root.innerHTML = educatorCourses.courseDescription || "";
      }
    }
  }, [educatorCourses]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!educatorCourses._id) {
        toast.error("Course ID missing!");
        return;
      }

      const updatedCourseData = {
        _id: educatorCourses._id,
        courseTitle,
        courseDescription: quillReff.current.root.innerHTML,
        courseMode,
        coursePrice: Number(coursePrice),
        coursePricePhysical: Number(coursePricePhysical),
        coursePriceVirtual: Number(coursePriceVirtual),
        courseAddress,
        meetingUrl,
        classSchedule,
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(updatedCourseData));
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/educator/update-course",
        formData,
        { headers: { atoken } }
      );

      if (data.success) {
        toast.success("Course updated successfully!");

        // Check role from localStorage to determine navigation
        const storedAdmin = localStorage.getItem('admin');
        let role = 'educator';
        if (storedAdmin) {
          try {
            const parsed = JSON.parse(storedAdmin);
            role = parsed.role;
          } catch (e) {
            console.error("Error parsing admin data:", e);
          }
        }

        if (role === 'admin') {
          navigate("/all-courses");
        } else {
          navigate("/educator-my-courses");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-xl rounded-3xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">✏️ Update Course</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Basic Info & Attendance */}
          <div className="space-y-3">

            {/* Course Title */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Introduction to Python"
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course Description</label>
              <div className="min-h-[120px] border border-gray-300 rounded-lg p-2">
                <div ref={editorReff} className="min-h-[100px]" />
              </div>
            </div>

            {/* Course Mode Selection */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course Mode</label>
              <select
                value={courseMode}
                onChange={(e) => setCourseMode(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Both">Both (Physical & Virtual)</option>
                <option value="Physical">Physical Only</option>
                <option value="Virtual">Virtual Only</option>
              </select>
            </div>

            {/* Physical Details */}
            {(courseMode === 'Physical' || courseMode === 'Both') && (
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-semibold">Class Location Address</label>
                <textarea
                  placeholder="e.g. Building A, Room 101, Main Campus"
                  value={courseAddress}
                  onChange={e => setCourseAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none text-sm"
                />
              </div>
            )}

            {/* Class Schedule */}
            {(courseMode === 'Physical' || courseMode === 'Virtual' || courseMode === 'Both') && (
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-semibold">Class Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mondays & Wednesdays at 10:00 AM"
                  value={classSchedule}
                  onChange={e => setClassSchedule(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {courseMode === 'Physical' ? 'When students should arrive.' : 'When students should join.'}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Pricing, Media & Content */}
          <div className="space-y-4">

            {/* Virtual Details */}
            {(courseMode === 'Virtual' || courseMode === 'Both') && (
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-semibold">Virtual Meeting Link</label>
                <input
                  type="url"
                  placeholder="e.g. https://zoom.us/j/123456789"
                  value={meetingUrl}
                  onChange={e => setMeetingUrl(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            )}

            {/* Pricing card */}
            <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="col-span-2 text-base font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-1">Pricing</div>

              {(courseMode === 'Physical' || courseMode === 'Both') && (
                <div>
                  <label className="block text-gray-700 mb-1 text-xs font-semibold">Physical ($)</label>
                  <input
                    type="number"
                    value={coursePricePhysical}
                    onChange={e => setCoursePricePhysical(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}

              {(courseMode === 'Virtual' || courseMode === 'Both') && (
                <div>
                  <label className="block text-gray-700 mb-1 text-xs font-semibold">Virtual ($)</label>
                  <input
                    type="number"
                    value={coursePriceVirtual}
                    onChange={e => setCoursePriceVirtual(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1 text-xs font-semibold">Base Price ($)</label>
                <input
                  type="number"
                  value={coursePrice}
                  onChange={e => setCoursePrice(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-xs font-semibold">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Thumbnail Upload Card */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course Thumbnail</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer h-24">
                <label htmlFor="thumbnailImage" className="flex flex-col items-center gap-1 cursor-pointer w-full h-full justify-center">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="h-full object-contain rounded"
                    />
                  ) : educatorCourses?.courseThumbnail ? (
                    <img
                      src={educatorCourses.courseThumbnail}
                      alt="Current Thumbnail"
                      className="h-full object-contain rounded"
                    />
                  ) : (
                    <>
                      <img src={assets.upload_area} alt="Upload" className="w-6 h-6" />
                      <p className="text-xs text-gray-500">Upload Thumbnail</p>
                    </>
                  )}
                  <input
                    type="file"
                    id="thumbnailImage"
                    onChange={e => setImage(e.target.files[0])}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {/* Chapters & Lectures */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Course Content</label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="bg-gray-50 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center p-2 border-b">
                      <div className="flex items-center gap-2">
                        <img
                          onClick={() => handleChapter('toggle', chapter.chapterId)}
                          src={assets.dropdown_icon}
                          alt=""
                          className={`w-3 h-3 transition-transform ${chapter.collapsed && "-rotate-90"}`}
                        />
                        <span className="font-semibold text-sm">
                          {chapterIndex + 1}. {chapter.chapterTitle}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{chapter.chapterContent.length} Lecs</span>
                      <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="" className="w-3 cursor-pointer" />
                    </div>

                    {!chapter.collapsed && (
                      <div className="p-2 space-y-1">
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex justify-between items-center bg-white px-2 py-1 rounded border shadow-sm">
                            <span className="text-xs truncate max-w-[150px]">
                              {lectureIndex + 1}. {lecture.lectureTitle}
                            </span>
                            <div className="flex items-center gap-2">
                              <img
                                src={assets.edit_icon}
                                alt="Edit"
                                className="w-3 cursor-pointer"
                                onClick={() => {
                                  setLectureDetails(lecture);
                                  setEditingLecture({ ...lecture, chapterId: chapter.chapterId });
                                  setCurrentChapterId(chapter.chapterId);
                                  setShowPopup(true);
                                }}
                              />
                              <img
                                src={assets.cross_icon}
                                alt="Remove"
                                className="w-3 cursor-pointer"
                                onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                              />
                            </div>
                          </div>
                        ))}
                        <div onClick={() => handleLecture('add', chapter.chapterId)} className="text-blue-600 text-xs cursor-pointer hover:underline">+ Add Lecture</div>
                      </div>
                    )}
                  </div>
                ))}

                <div
                  onClick={() => handleChapter('add')}
                  className="flex justify-center items-center p-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium cursor-pointer hover:bg-blue-200"
                >
                  + Add Chapter
                </div>

                {/* Popup Modal */}
                {showPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-sm mx-4">
                      <button
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg"
                        onClick={() => {
                          setShowPopup(false);
                          setEditingLecture(null);
                          setLectureDetails({
                            lectureTitle: '',
                            lectureDuration: '',
                            lectureUrl: '',
                            isPreview: false,
                          });
                        }}
                      >
                        ✕
                      </button>
                      <h2 className="text-lg font-semibold mb-4 text-center">
                        {editingLecture ? "Edit Lecture" : "Add Lecture"}
                      </h2>
                      <div className="mb-2">
                        <p className="text-sm font-medium">Title</p>
                        <input
                          type="text"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureTitle}
                          onChange={(e) => setLectureDetails({
                            ...lectureDetails,
                            lectureTitle: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium">Duration (mins)</p>
                        <input
                          type="number"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureDuration}
                          onChange={(e) => setLectureDetails({
                            ...lectureDetails,
                            lectureDuration: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium">URL</p>
                        <input
                          type="text"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureUrl}
                          onChange={(e) => setLectureDetails({
                            ...lectureDetails,
                            lectureUrl: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={lectureDetails.isPreview}
                            onChange={(e) => setLectureDetails({
                              ...lectureDetails,
                              isPreview: e.target.checked
                            })}
                          />
                          Free Preview?
                        </label>
                      </div>
                      <button type="button" className="w-full bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600"
                        onClick={addLecture}
                      >
                        {editingLecture ? "Update Lecture" : "Add Lecture"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button (Full Width) */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white text-lg rounded-xl font-bold hover:bg-blue-600 transition duration-300 shadow-lg"
          >
            💾 Save Changes
          </button>
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  );

};

export default UpdateCourse;
