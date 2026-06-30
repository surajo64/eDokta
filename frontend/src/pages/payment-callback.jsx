import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Loading from '../components/loading';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {backendUrl} = useContext(AppContext)

  useEffect(() => {
    const reference = searchParams.get("reference");
    const courseId = localStorage.getItem("pendingCourseId"); // retrieve saved courseId
    const token = localStorage.getItem("token"); // must match key used in login

    if (!reference || !courseId || !token) {
      toast.error("Missing payment info!");
      return navigate("/my-courses");
    }

    axios.post(
      backendUrl + "/api/user/verify-payment",
      {
        reference,
        courseId,
      },
      { headers: { token } }
    )
    .then((res) => {
      toast.success(res.data.message);
      localStorage.removeItem("pendingCourseId"); // cleanup
      navigate("/my-courses");
    })
    .catch((err) => {
      console.error(err.response?.data || err.message);
      toast.error("Verification failed!");
      localStorage.removeItem("pendingCourseId");
      navigate("/my-courses");
    });
  }, [searchParams, navigate]);

  return <Loading/>;
};

export default PaymentCallback;
