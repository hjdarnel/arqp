interface FileInputProps {
  required: boolean;
  type: string;
  name: string;
  fileChangeHandler: (x: any) => void;
}
export default function FileInput({
  required,
  type,
  name,
  fileChangeHandler
}: FileInputProps) {
  return (
    <input
      required={required}
      type={type}
      name={name}
      onChange={fileChangeHandler}
    />
  );
}
