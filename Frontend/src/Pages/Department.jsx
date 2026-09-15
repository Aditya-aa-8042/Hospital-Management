import Navbar from '../Component/Navbar'

const Department = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>   
      <Navbar />
      <div className='max-w-7xl mx-auto px-6 py-20'>
        <h1 className='text-4xl md:text-6xl font-bold leading-tight text-blue-600 mb-8'>Departments</h1>
        <p className='text-lg text-gray-700 mb-12'>
          Our hospital offers a wide range of specialized departments to cater to the diverse healthcare needs of our patients. Each department is staffed with experienced medical professionals and equipped with state-of-the-art facilities to provide the highest quality care.
        </p>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
            <h2 className='text-xl font-semibold text-blue-600 mb-4'>Cardiology</h2>
            <p className='text-gray-700'>           
                Our Cardiology department specializes in the diagnosis and treatment of heart-related conditions. Our team of cardiologists is dedicated to providing comprehensive care for patients with cardiovascular diseases.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
            <h2 className='text-xl font-semibold text-blue-600 mb-4'>Neurology</h2>
            <p className='text-gray-700'>
                The Neurology department focuses on the diagnosis and management of neurological disorders. Our neurologists are skilled in treating conditions such as epilepsy, stroke, and neurodegenerative diseases.   
            </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
            <h2 className='text-xl font-semibold text-blue-600 mb-4'>Orthopedics</h2>
            <p className='text-gray-700'>
                Our Orthopedics department provides comprehensive care for musculoskeletal conditions. Our orthopedic surgeons specialize in joint replacement, sports injuries, and fracture management.
            </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
            <h2 className='text-xl font-semibold text-blue-600 mb-4'>Pediatrics</h2>
            <p className='text-gray-700'>
                The Pediatrics department is dedicated to the health and well-being of children. Our pediatricians provide preventive care, vaccinations, and treatment for various childhood illnesses.
            </p>    
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
            <h2 className='text-xl font-semibold text-blue-600 mb-4'>Oncology</h2>
            <p className='text-gray-700'>
                The Oncology department is committed to providing comprehensive cancer care. Our oncologists work closely with other specialists to develop personalized treatment plans for each patient.
            </p>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Department;
