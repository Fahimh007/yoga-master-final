import React from 'react'
import img1 from '../../../assets/gallary/img1.jpg'
import img2 from '../../../assets/gallary/img2.jpg'
import img3 from '../../../assets/gallary/img3.jpg'
import img4 from '../../../assets/gallary/img4.jpg'
import img5 from '../../../assets/gallary/img5.jpg'

const Gallary = () => {
  return (
    <div className='md:w-[80%] mx-auto my-28'>
      <div className='mb-16'>
        <h1 className='text-5xl font-bold text-center text-black dark:text-white'>Gallary img</h1>
      </div>
      <div className='md:grid grid-cols-2 gap-4 flex item-center justify-center'>
        <div className='mb-4 md:mb-0'>
          <img src={img5} alt="img5" className='md:h-[720px] w-full mx-auto rounded-sm'/>
        </div>
        <div className='gap-4 grid grid-cols-2 items-start'>
          <div className=''>
            <img src={img4} alt="img5" className='md:h-[350px] rounded-sm'/>
          </div>
          <div>
            <img src={img4} alt="img5" className='md:h-[350px] rounded-sm'/>
          </div>
          <div>
            <img src={img4} alt="img5" className='md:h-[350px] rounded-sm'/>
          </div>
          <div>
            <img src={img4} alt="img5" className='md:h-[350px] rounded-sm'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallary
