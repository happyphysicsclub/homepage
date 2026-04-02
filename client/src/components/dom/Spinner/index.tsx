export function Spinner(props: { progress: number }) {
  return (
    <>
      <div className='w-fit h-fit flex flex-col justify-center items-center'>
        <div className='mt-4 w-[150px] h-[10px] border-2 border-white flex justify-start items-center'>
          <div
            className='h-[100%] bg-white'
            style={{
              width: `${props.progress}%`,
            }}
          />
        </div>
        <div className='py-1 text-xl font-bold text-white h-fit'>{props.progress}%</div>
      </div>
    </>
  )
}
