import { ReactNode } from 'react';
import Uploading from 'components/nova/Uploading';
import { useDropzone } from 'react-dropzone';

interface Props {
  onDrop: () => void;
  children: ReactNode;
}

export default function DragAndDrop({ onDrop, children }: Props) {
  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  return <div {...getRootProps()}>{isDragActive ? <Uploading /> : <div>{children}</div>}</div>;
}
