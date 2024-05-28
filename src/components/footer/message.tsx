import { RiErrorWarningFill, RiCheckFill } from 'react-icons/ri';

interface Props {
  title: string;
}
export function ErrorMessage(props: Props) {
  return (
    <p className='flex items-center gap-4 rounded-md bg-red-100 p-2 px-4 text-red-600'>
      <RiErrorWarningFill /> {props.title}
    </p>
  );
}

export function SuccessMessage(props: Props) {
  return (
    <p className='flex items-center gap-4 rounded-md bg-green-100 p-2 px-4 text-green-600'>
      <RiCheckFill /> {props.title}
    </p>
  );
}
