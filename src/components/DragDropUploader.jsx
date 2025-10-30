import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

export default function DragDropUploader({ onFiles, maxFiles=8 }) {
  const [busy, setBusy] = useState(false);
  const onDrop = useCallback(async (accepted) => {
    setBusy(true);
    const out = [];
    for (const f of accepted.slice(0, maxFiles)) {
      try {
        const compressed = await imageCompression(f, { maxWidthOrHeight: 1600, maxSizeMB: 1.2, useWebWorker: true });
        out.push(new File([compressed], f.name.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp'), { type: 'image/webp' }));
      } catch(e) { out.push(f); }
    }
    onFiles?.(out);
    setBusy(false);
  }, [onFiles, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'] },
    multiple: true, onDrop
  });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${isDragActive ? 'bg-gray-50' : ''}`}>
      <input {...getInputProps()} />
      <p className="text-sm">{busy ? 'A comprimir...' : 'Arraste e largue aqui ou clique para escolher imagens (opcional)'}</p>
    </div>
  );
}
