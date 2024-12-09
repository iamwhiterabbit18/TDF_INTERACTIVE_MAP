import { toast, Slide } from 'react-toastify';

const UseToast = () => {
    const mountToast = (message, type ) => {
        const toastSettings = {
            position: "top-center",
            autoClose: 2500,
            limit: 2,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "light",
            progress: null,
            transition: Slide,
        }

        switch (type) {
            case "success":
                toast.success(message, toastSettings);
                break;
            case "error":
                toast.error(message, toastSettings);
                break;
            case "warn":
                toast.warn(message, toastSettings);
                break;
            default:
                toast.success(message, toastSettings);
        }
    };

    return mountToast;
}

export default UseToast;