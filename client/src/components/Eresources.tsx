import { useState } from "react";
import { BookOpen, FileText, Video, Download, ChevronDown } from 'lucide-react';
// Resource type interfaces
interface Resource {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'quiz' | 'notes' | 'link'; // Add 'link'
    subject: string;
    url: string;
  }
  

interface GradeLevel {
  id: string;
  name: string;
  resources: Resource[];
}

// Sample data for resources
const gradeLevels: GradeLevel[] = [
  {
    id: 'highschool',
    name: 'High School',
    resources: [
      { id: 'hsebook', title: 'eBooks', type: 'link', subject: 'General', url: 'https://www.ncert.nic.in/textbook.php' },
      { id: 'hseresources', title: 'eResources', type: 'link', subject: 'General', url: 'https://www.ncert.nic.in/eresources.php' },
      { id: 'hschem1', title: 'Periodic Table', type: 'pdf', subject: 'Chemistry', url: '#' },
      { id: 'hsphys1', title: 'Motion and Forces', type: 'video', subject: 'Physics', url: '#' },
      { id: 'hsmath1', title: 'Algebra Fundamentals', type: 'quiz', subject: 'Mathematics', url: '#' },
    ]
  },
    {
      id: 'higherschool',
      name: 'Higher Seconadary School',
      resources: [
        { id: 'hsebook', title: 'eBooks', type: 'link', subject: 'General', url: 'https://www.ncert.nic.in/textbook.php' },
        { id: 'hseresources', title: 'eResources', type: 'link', subject: 'General', url: 'https://www.ncert.nic.in/eresources.php' },
       
      ]
    },
  {
    id: 'undergraduate',
    name: 'Undergraduate',
    resources: [
      { id: 'ugcs1', title: 'Introduction to Programming', type: 'pdf', subject: 'Computer Science', url: '#' },
      { id: 'ugbio1', title: 'Cell Biology', type: 'video', subject: 'Biology', url: '#' },
      { id: 'ugstat1', title: 'Statistical Methods', type: 'notes', subject: 'Statistics', url: '#' },
    ]
  },
];

// Resource item component
const ResourceItem = ({ resource }: { resource: Resource }) => {
    const getIcon = () => {
      switch (resource.type) {
        case 'pdf':
          return <FileText className="w-5 h-5 text-red-500" />;
        case 'video':
          return <Video className="w-5 h-5 text-blue-500" />;
        case 'quiz':
          return <BookOpen className="w-5 h-5 text-purple-500" />;
        case 'notes':
          return <FileText className="w-5 h-5 text-green-500" />;
        case 'link':
            return <BookOpen className="w-5 h-5 text-orange-500" />;
        
        default:
          return <FileText className="w-5 h-5 text-gray-500" />;
      }
    };
  
    return (
      <div className="flex items-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="mr-3 p-2 bg-gray-50 rounded-full">
          {getIcon()}
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-gray-800">{resource.title}</h3>
          <p className="text-xs text-gray-500">{resource.subject}</p>
        </div>
        {resource.type === 'link' ? (
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Open
          </a>
        ) : (
          <button className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Access
          </button>
        )}
      </div>
    );
  };
  

// Grade level dropdown component
const GradeLevelDropdown = ({ gradeLevel, isOpen, onToggle }: { 
  gradeLevel: GradeLevel, 
  isOpen: boolean, 
  onToggle: () => void 
}) => {
  return (
    <div className="mb-3 bg-white rounded-xl shadow-md overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-100 to-purple-100 hover:from-violet-200 hover:to-purple-200 transition-all"
      >
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-violet-600 mr-2" />
          <h3 className="font-medium text-violet-800">{gradeLevel.name}</h3>
        </div>
        <ChevronDown 
          className="w-5 h-5 text-violet-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}"
        />
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-2">
          {gradeLevel.resources.map(resource => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

// Resources section component
const Eresources = () => {
  const [openGradeId, setOpenGradeId] = useState<string>(gradeLevels[0].id);
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-white rounded-full mb-6 shadow-md">
            
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
            Educational Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access a comprehensive collection of learning materials across all grade levels, from Class 1 to undergraduate studies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Filter sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Grade Levels</h3>
              
              <div className="space-y-2">
                {gradeLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setOpenGradeId(level.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      openGradeId === level.id 
                        ? 'bg-violet-100 text-violet-800 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4 border-b pb-2">Resource Types</h3>
              <div className="space-y-2">
                {['All Types', 'PDFs', 'Videos', 'Quizzes', 'Notes'].map(type => (
                  <div key={type} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="type-${type}" 
                      className="mr-2 h-4 w-4 text-violet-600 focus:ring-violet-500 rounded" 
                    />
                    <label htmlFor="type-${type}" className="text-sm text-gray-700">{type}</label>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4 border-b pb-2">Subjects</h3>
              <div className="space-y-2">
                {['All Subjects', 'Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science'].map(subject => (
                  <div key={subject} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="subject-${subject}" 
                      className="mr-2 h-4 w-4 text-violet-600 focus:ring-violet-500 rounded" 
                    />
                    <label htmlFor="subject-${subject}" className="text-sm text-gray-700">{subject}</label>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Resources content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Available Resources
                </h3>
                
                <div className="flex items-center space-x-2">
                  <select className="text-sm border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option>Most Popular</option>
                    <option>Newest First</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {gradeLevels.map(grade => (
                  <GradeLevelDropdown 
                    key={grade.id}
                    gradeLevel={grade}
                    isOpen={openGradeId === grade.id}
                    onToggle={() => setOpenGradeId(grade.id === openGradeId ? '' : grade.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Featured resources section */}
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-violet-800 mb-4">Featured Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">Advanced Calculus Video Series</h4>
                    <p className="text-xs text-gray-600">Mathematics • Undergraduate</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
                  <div className="bg-red-100 p-3 rounded-full mr-3">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">Complete Science Revision Notes</h4>
                    <p className="text-xs text-gray-600">Science • High School</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eresources;