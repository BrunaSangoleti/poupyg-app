
interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    type?: 'red' | 'green' | 'action';
}

const Button = ({ children, onClick, type = 'red' }: ButtonProps) => {
    // Mapeamento das antigas classes red/green/action para o novo Tailwind Semântico
    const variantClasses = {
        red: 'bg-error text-white hover:bg-error/90',
        green: 'bg-secondary text-white hover:bg-secondary/90',
        action: 'bg-primary text-white hover:bg-primary/90',
    };

    return (
        <button
            className={`px-space-md py-2.5 rounded-xl font-label-button transition-colors ${variantClasses[type]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;