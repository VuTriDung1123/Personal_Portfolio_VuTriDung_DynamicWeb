"use client";

/* eslint-disable @next/next/no-img-element */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    desc: string;
    tech?: string;
    images?: string[];
    link?: string;
  };
}

export default function Modal({ isOpen, onClose, content }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2 className="modal-title">{content.title}</h2>
        {content.tech && <p className="modal-tech">{content.tech}</p>}
        <p className="modal-desc">{content.desc}</p>

        {content.images && content.images.length > 0 && (
          <div className="modal-gallery-grid">
            {content.images.map((img, idx) => <img key={idx} src={img} alt="Gallery" />)}
          </div>
        )}

        {content.link && <a href={content.link} target="_blank" className="btn btn-primary" style={{ marginTop: 20 }}>View Details</a>}
      </div>
    </div>
  );
}