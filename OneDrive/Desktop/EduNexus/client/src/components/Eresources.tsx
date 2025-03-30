import { useState } from "react";
import { GraduationCap, FileText, Download, ChevronDown } from "lucide-react";

// Resource type interfaces
interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "quiz" | "notes" | "link";
  subject: string;
  url: string;
}

interface GradeLevel {
  id: string;
  name: string;
  resources: Resource[];
}

const gradeLevels: GradeLevel[] = [
  {
    id: "highschool",
    name: "High School",
    resources: [
      {
        id: "hsebook",
        title: "NCERT eBooks",
        type: "link",
        subject: "General",
        url: "https://www.ncert.nic.in/textbook.php",
      },
      {
        id: "hseresources",
        title: "NCERT eResources",
        type: "link",
        subject: "General",
        url: "https://www.ncert.nic.in/eresources.php",
      },
    ],
  },
  {
    id: "higherschool",
    name: "Higher Secondary School",
    resources: [
      {
        id: "hsebook",
        title: "NCERT eBooks",
        type: "link",
        subject: "General",
        url: "https://www.ncert.nic.in/textbook.php",
      },
      {
        id: "hseresources",
        title: "NCERT eResources",
        type: "link",
        subject: "General",
        url: "https://www.ncert.nic.in/eresources.php",
      },
    ],
  },
  {
    id: "undergraduate",
    name: "Undergraduate",
    resources: [
      { id: "ugcs1", title: "Intro to Programming", type: "pdf", subject: "CS", url: "#" },
      { id: "ugbio1", title: "Cell Biology", type: "video", subject: "Biology", url: "#" },
      { id: "ugstat1", title: "Statistical Methods", type: "notes", subject: "Statistics", url: "#" },
    ],
  },
];

const ResourcesSection = () => {
  const [openGradeId, setOpenGradeId] = useState<string>("");

  return (
    <section className="py-16 bg-gradient-to-b from-purple-100 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-lg">
            <GraduationCap className="w-12 h-12 text-violet-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Educational Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore a curated collection of study materials across different education levels.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1 h-full">
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Levels</h3>
              <div className="space-y-3">
                {gradeLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setOpenGradeId(level.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${openGradeId === level.id ? "bg-violet-100 text-violet-800" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Resources</h3>
              <div className="space-y-4">
                {gradeLevels.map((grade) => (
                  <div key={grade.id} className="mb-4 bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => setOpenGradeId(grade.id === openGradeId ? "" : grade.id)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-200 to-purple-200 hover:from-violet-300 hover:to-purple-300 transition-all"
                    >
                      <h3 className="font-medium text-violet-900">{grade.name}</h3>
                      <ChevronDown className={`w-6 h-6 text-violet-700 transition-transform ${openGradeId === grade.id ? "rotate-180" : ""}`} />
                    </button>
                    {openGradeId === grade.id && (
                      <div className="p-4 space-y-3 bg-gray-50">
                        {grade.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                            <div className="mr-4 p-3 bg-gray-100 rounded-full">
                              <FileText className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-sm font-semibold text-gray-800">{resource.title}</h3>
                              <p className="text-xs text-gray-500">{resource.subject}</p>
                            </div>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center"
                            >
                              <Download className="w-4 h-4 mr-1" /> Open
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;