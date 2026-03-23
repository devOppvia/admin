import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMG_URL = import.meta.env.VITE_IMG_URL;

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });
const addressApi = axios.create({ baseURL: BASE_URL, withCredentials: true });

const getAccessToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

addressApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginApi = async (userData) => {
  try {
    const response = await api.post(`/auth/admin-login`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Login failed";
  }
};

export const getPopUpConfigurationApi = async (userData) => {
  try {
    const response = await api.post(
      "/popup-configuration/get-popups",
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Check Network Connection";
  }
};

export const deletePopUpConfigurationApi = async (userData) => {
  try {
    const response = await api.delete(
      `/popup-configuration/delete-popup-configuration/${userData.id}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Check Network Connection";
  }
};

export const createExhibitionApi = async (userData) => {
  try {
    const response = await api.post("/exhibition/create-exhibition", userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Check Network Connection";
  }
};
export const createBlogCategoryApi = async (userData) => {
  try {
    const response = await api.post(`/blog-category/create-category`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createGalleryCategoryApi = async (userData) => {
  try {
    const response = await api.post(
      `/gallery-category/create-gallery-category`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateBlogCategoryApi = async (userData) => {
  try {
    let { id } = userData;
    const response = await api.put(
      `/blog-category/update-category/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateGalleryCategoryApi = async (userData) => {
  try {
    let { id } = userData;
    const response = await api.put(
      `/gallery-category/update-gallery-category/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getBlogCategoriesApi = async (userData) => {
  try {
    const response = await api.get(
      `/blog-category/get-categories`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getGalleryCategoriesApi = async (userData) => {
  try {
    const response = await api.get(
      `/gallery-category/get-gallery-category`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteBlogcategoryApi = async (userData) => {
  try {
    const response = await api.delete(
      `/blog-category/delete-category/${userData?.id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteGallerycategoryApi = async (userData) => {
  try {
    const response = await api.delete(
      `/gallery-category/delete-gallery-category/${userData?.id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Tags

export const createBlogTagsApi = async (userData) => {
  try {
    const response = await api.post(`/blog-tag/create-tag`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateBlogTagsApi = async (userData) => {
  try {
    const response = await api.put(
      `/blog-tag/update-tag/${userData?.id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getBlogTagsApi = async (userData) => {
  try {
    const response = await api.get(`/blog-tag/get-all-tags`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteBlogTagsApi = async (userData) => {
  try {
    const response = await api.delete(`/blog-tag/delete-tag/${userData?.id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get All Blogs

export const getAllBlogsApi = async (userData) => {
  try {
    const response = await api.post(`/blogs/get-all-blogs-admin`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Create Blog

export const createBlogApi = async (formData) => {
  try {
    const token = getAccessToken();

    const response = await axios.post(
      `${BASE_URL}/blogs/create-blog`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // throw error.response?.data?.message || "failed!";

    error.customMessage = error.response?.data?.message || "Failed";
    throw error;
  }
};

export const updateBlogApi = async (formData, id) => {
  try {
    const token = getAccessToken();

    const response = await axios.put(
      `${BASE_URL}/blogs/update-blog/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // throw error.response?.data?.message || "failed!";

    error.customMessage = error.response?.data?.message || "Failed";
    throw error;
  }
};

//Delete Blogs

export const deleteBlogsApi = async (userData) => {
  try {
    const response = await api.delete(`/blogs/delete-blog/${userData?.id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Slider Management

export const getSliderImagesApi = async () => {
  try {
    const response = await api.get(`/slider/get-slider-images`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const addSliderImageApi = async (userData) => {
  try {
    const response = await api.post(`/add-slider-image/admin`, userData);
    return response.data;
  } catch (error) {
    error.customMessage = error.response?.data?.message || "Failed";
    throw error;
  }
};

export const deleteSliderImageApi = async (userData) => {
  try {
    const response = await api.delete(
      `/slider/delete-slider-image/${userData.id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createCaseStudyApi = async (userData) => {
  try {
    const token = getAccessToken();

    const response = await axios.post(
      `${BASE_URL}/create-and-update-case-study/admin`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    error.customMessage = error.response?.data?.message || "Failed";
    throw error;
  }
};

//Get All Case Studies

export const getCaseStudies = async () => {
  try {
    const response = await api.get(`/get-case-study/admin`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteCaseStudies = async (userData) => {
  try {
    const response = await api.post(`/delete-case-study/admin`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardDetailsApi = async (userData) => {
  try {
    const response = await api.get(
      `/dashboard/get-dashboard-details`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

//Get Contact Inquiry API

// /get-contact-inquiry

export const getContactInquiryAPi = async (userData) => {
  try {
    const response = await api.get(
      `/contact-us`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getBookedInquiry = async (userData) => {
  try {
    const response = await api.get(`/appointment/get-appointment`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getTestimonialsApi = async (userData) => {
  try {
    let response = await api.get(`/testimonials/get-testimonials`);
    return response.data;
  } catch (error) {
    throw error.reponse.data.message || "Check Network Connection";
  }
};

export const deleteTestimonialApi = async (id) => {
  try {
    let response = await api.delete(`/testimonials/delete-testimonial/${id}`);
    return response.data;
  } catch (error) {
    throw error.reponse.data.message || "Check Network Connection";
  }
};

export const changePasswordApi = async (userData) => {
  try {
    const response = await api.put(`/auth/change-password`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getFaqCategoryApi = async (userData) => {
  try {
    const response = await api.get(
      `/faq-category/get-all-categories`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getAllFaqsApi = async (userData) => {
  try {
    const response = await api.get(`/faq/get-faqs`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createFaqCategoryApi = async (userData) => {
  try {
    const response = await api.post(`/faq-category/create-category`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const createFaqsApi = async (userData) => {
  try {
    const response = await api.post(`/faq/create-faq`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateFaqCategoryApi = async (userData) => {
  try {
    let { id } = userData;
    const response = await api.put(
      `/faq-category/update-category/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteFaqCategoryApi = async (userData) => {
  try {
    const response = await api.delete(
      `/faq-category/delete-category/${userData?.id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteFaqApi = async (userData) => {
  try {
    const response = await api.delete(`/faq/delete-faq/${userData?.id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateFaqApi = async (userData) => {
  try {
    let { id } = userData;
    const response = await api.put(`/faq/update-faq/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getAllClientLogosApi = async (userData) => {
  try {
    const response = await api.get(`/client-logos/get-client-logos`, userData);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteClientLogosApi = async (userData) => {
  try {
    const response = await api.delete(
      `/client-logos/delete-client-logo/${userData?.id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const updateClientLogosApi = async (userData) => {
  try {
    let { id } = userData;
    const response = await api.put(
      `/client-logos/update-client-logo/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const getExhibitionDataApi = async (userData) => {
  try {
    const response = await api.post(`/exhibition/get-exhibition`, {
      exhibitionType: userData,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

export const deleteExhibitionDataApi = async (userData) => {
  try {
    let { id } = userData;

    const response = await api.delete(`/exhibition/delete-exhibition/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Check Network Connection";
  }
};

// Internship Project New Apis

export const getAllRegisteredCompanysApi = async (status) => {
  try {
    let response = await api.get(`/company/get-registered-companies/${status}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Something went wrong";
  }
};

export const changeCompanyStatusApi = async (id, status, reason) => {
  try {

    let response = await api.put(`/company/update-company-status/${id}`, {
      companyStatus: status,
      reason: reason
    });
    return response.data;
  } catch (error) {
    // throw error.response.data.message || "Something went wrong"
    return error.response.data;
  }
};

export const createJobCategory = async (categoryName) => {
  try {
    let response = await api.post(
      "/job-category/create-category",
      categoryName
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getJobCategory = async (currentPage, itemsPerPage) => {
  try {
    let body = { currentPage: currentPage, itemsPerPage: itemsPerPage };
    let response = await api.post("/job-category/admin/get-categories", body);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getJobCategoryForSubCategory = async () => {
  try {
    let response = await api.get("/job-category/admin/sub-category/category");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteJobCategory = async (data) => {
  try {
    let response = await api.delete(`/job-category/delete-category/${data.id}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const updateJobCategory = async (id, categoryName) => {
  try {
    let response = await api.put(`/job-category/update-category/${id}`, {
      categoryName,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const createJobSubCategory = async (data) => {
  try {
    let response = await api.post("/job-subCategory/create-subCategory", data);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getJobSubCategory = async (
  selectedCategory,
  currentPage,
  itemsPerPage
) => {
  try {
    let response = await api.post("/job-subCategory/admin/get-subCategories", {
      jobCategoryId: selectedCategory,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getJobSubCategoryForSkills = async (selectedCategory) => {
  try {
    let body = { jobCategoryId: selectedCategory }
    let response = await api.post(`/job-subCategory/admin/skills/sub-categories`, body)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const updateJobSubCategory = async (
  id,
  subCategoryName,
  jobCategoryId
) => {

  try {
    let response = await api.put(`/job-subCategory/update-subCategory/${id}`, {
      subCategoryName,
      jobCategoryId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const deleteJobSubCategory = async (data) => {
  try {
    let response = await api.delete(
      `/job-subCategory/delete-subCategory/${data.id}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getJobSkills = async (data) => {
  try {
    let response = await api.post("/skills/admin/get-skills", data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteJobSkill = async (data) => {
  try {
    let response = await api.delete(`/skills/delete-skill/${data.id}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message
  }
};

export const getSubscriptionPlans = async (activeTab) => {
  try {
    let response = await api.get(
      `/subscription/admin/get-subscriptions`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteSubscriptionPlan = async (id) => {
  try {
    let response = await api.delete(
      `/subscription/admin/delete-subscription-plan/${id}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createSubscriptionPlan = async (data) => {
  try {
    let response = await api.post(
      "/subscription/create-subscription-plan",
      data
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateSubscriptionPackage = async (id, data) => {
  try {
    let response = await api.put(
      `/subscription/admin/update-subscription-plan/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getSupportTicketsList = async (body) => {
  try {
    let response = await api.post("/support/admin/get-all-supports", body);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getSupportMessages = async (body) => {
  try {
    let response = await api.post("/support/get-support-messages", body);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendSupportMessage = async (body) => {
  try {
    let response = await api.post("/support/add-support-message", body);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error)
    return error.response;
  }
};

export const getJobPositions = async (activeTab, itemsPerPage, currentPage) => {
  try {
    let body = {
      jobStatus: activeTab,
      itemsPerPage: itemsPerPage,
      currentPage: currentPage,
    };
    let response = await api.post(`/jobs/admin/get-jobs`, body);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const changeJobStatus = async (id, status, rejectReason) => {
  try {
    let response = await api.put(`/jobs/update-job-status/${id}`, {
      jobStatus: status,
      reason: rejectReason,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const generateSubCategory = async (status) => {
  try {
    let response = await api.post(`/jobs/generate-subcategory`, {
      category: status,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteJobPosition = async (id) => {
  try {
    let response = await api.delete(`/jobs/delete-job/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getDashboardDetailsAdminApi = async () => {
  try {
    let response = await api.post("/admin/get-dashboard-details");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const jobCategoryGetAiSuggetions = async (body) => {
  try {
    let response = await api.post("/job-category/generate-job-categories", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const jobSubCategoryGetAiSuggetions = async (body) => {
  try {
    let response = await api.post("/job-subCategory/generate-sub-categories", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const generateJobSkillsGetAiSuggestions = async (body) => {
  try {
    let response = await api.post("/skills/generate-new-skills", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const updateBulkJobStatus = async (body) => {
  try {
    let response = await api.put("/jobs/update-bulk-status", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const createJobSkills = async (body) => {
  try {
    let response = await api.post("/skills/create-skill", body)
    return response.data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateJobSkills = async (id, data) => {
  try {
    let response = await api.put(`/skills/update-skill/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response.data.message
  }
}

export const closeSupportTicket = async (body) => {
  try {
    let response = await api.post("/support/close-support", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const getResumesForResumeBank = async (activeTab) => {
  try {

    let response = await api.get(`/resume-bank/get-resume/${activeTab}`,)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const updateResumeStatus = async (id) => {
  try {
    let response = await api.put(`/resume-bank/update-resume-status/${id}`)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const deleteResume = async (id) => {
  try {
    let response = await api.delete(`/resume-bank/admin/delete-resume/${id}`)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export const updateBulkResumeStatus = async (body) => {
  try {
    let response = await api.put("/resume-bank/update-bulk-resume-status", body)
    return response.data
  } catch (error) {
    console.error(error);
    return error.response.data
  }
}

export { api, addressApi };
