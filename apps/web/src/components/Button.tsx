interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
    className={`btn-primary px-4 py-2 rounded text-white bg-primary hover:bg-primary-dark transition ${props.className || ''}`}

    >
      {children}
    </button>
  );
}