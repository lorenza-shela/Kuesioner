import { RiCloseLine } from 'react-icons/ri';
import { dialogProps } from '@/types/globalTypes';

export default function Dialog(props: dialogProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full max-w-full items-center justify-center bg-black/50 px-4 ${props.className}`}>
      <div className='max-w-4xl rounded-lg bg-white p-5 text-center'>
        <div onClick={props.onClose} className='flex cursor-pointer justify-end text-2xl'>
          <RiCloseLine />
        </div>
        <div className='mt-4'>
          <h3 className='flex items-center justify-center gap-2 text-xl font-bold'>
            {props.icon} {props.title}
          </h3>
          <p className='mt-2'>{props.subtitle}</p>
        </div>
        <div>{props.children}</div>
        <div className='mt-6 flex items-center justify-center gap-6'>
          <button onClick={props.onCancel} type='button' className='border-primary text-primary w-28 rounded-full border px-4 py-2 font-medium'>
            {props.cancelText}
          </button>
          <button onClick={props.onSubmit} className='w-28 rounded-full bg-red-600 px-4 py-2 text-white'>
            {props.isLoading ? <div className='custom-loader mx-auto'></div> : props.submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
