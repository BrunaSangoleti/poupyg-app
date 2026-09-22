import { useNavigate } from 'react-router-dom';
import Title from './Title';
import Button from './Button';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-space-xl">
            <div className="flex flex-col items-center text-center max-w-md gap-space-lg bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm border border-outline-variant">
                <span className="material-symbols-outlined text-[80px] text-error">sentiment_dissatisfied</span>
                <div className="flex flex-col gap-space-sm">
                    <Title level='h1'>Ops! Página não encontrada</Title>
                    <p className="font-body-md text-on-surface-variant">
                        Não encontramos a página que você procura, mas não se preocupe: seus dados estão seguros e o caminho de volta é logo abaixo.
                    </p>
                </div>
                <Button type='action' onClick={() => navigate('/home')}>
                    Voltar para o Dashboard
                </Button>
            </div>
        </div>
    );
};