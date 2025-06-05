import React from 'react'

const Shimmer = () => {
  return (
    <div className="animate-pulse space-y-4 px-4">
      {[...Array(7)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="bg-gray-300 rounded-full h-6 w-6"></div>
          <div className="flex-1 space-y-2 py-1">
            {/* <div className="h-4 bg-gray-300 rounded w-3/4"></div> */}
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Shimmer
