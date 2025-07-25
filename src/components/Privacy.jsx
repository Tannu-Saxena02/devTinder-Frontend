import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Privacy = () => {
  const navigate = useNavigate();
  const termsRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const theme = useSelector((state) => state.theme);
  const isterms = useSelector((state) => state.isterms);

  const handleAccept = () => {
    navigate("/profile");
  };

  const scrollToBottom = () => {
    if (termsRef.current) {
      termsRef.current.scrollTo({
        top: termsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="w-full  flex justify-center items-center px-2"
      style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
    >
      <div
        className="card w-full max-w-7xl p-6"
        style={{ backgroundColor: theme === "dark" ? "#1D232A" : "#DBDBDB" }}
      >
        <div className="flex justify-center items-center ">
          <h2
            className="font-bold text-center text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            Privacy Policy
          </h2>
        </div>
        <div
          ref={termsRef}
          className={`overflow-y-auto w-full {isterms?"h-[50vh]":"h-full"}  p-4  text-base text-gray-700 leading-relaxed`}
          style={{ color: theme === "dark" ? "#ffffff" : "black" }}
        >
          <div
           className="text-[10px] sm:text-[10px] md:text-[13px] lg:text-[14px]">
            Welcome! Before using our platform, please review our Terms and
            Conditions. By proceeding, you agree to comply with and be bound by
            the following terms...
            <br />
            <br />
            This Privacy Policy (the “Policy”) governs the manner in which the
            Platform collects, uses, maintains and discloses information of its
            users. The Policy also describes the practices that We apply to such
            user information, user’s privacy rights and choices regarding their
            information. To clarify, this Policy applies to all users of the
            Platform (referred to as “Learners”, “You”, “Your”). By accessing
            and using the Platform, providing Your Personal Information, or by
            otherwise signalling Your agreement when the option is presented to
            You, You consent to the collection, use, and disclosure of
            information described in this Policy and Terms of Use and we
            disclaim all the liabilities arising therefrom. If You do not agree
            with any provisions of this Policy and/or the Terms of Use, You
            should not access or use the Platform or engage in communications
            with us and are required to leave the Platform immediately. If any
            information You have provided or uploaded on the Platform violates
            the terms of this Policy or Terms of Use, we may be required to
            delete such information upon informing You of the same and revoke
            Your access if required without incurring any liability to You.
            Capitalized terms used but not defined in this Privacy Policy can be
            found in our Terms of Use. Please read this Policy carefully prior
            to accessing our Platform and using any of the services or products
            offered therein. If you have any questions, please contact us at the
            contact information provided below.
            <br />
            <br />
            <strong> 1. PERSONAL INFORMATION</strong>
            <br />
            “Personal Information” shall mean the information which identifies a
            Learner i.e., first and last name, identification number, age,
            gender, location, photograph and/or phone number provided at the
            time of registration or any time thereafter on the Platform.
            “Sensitive Personal Information” shall include (i) passwords and
            financial data (except the truncated last four digits of
            credit/debit card), (ii) health data, (iii) official identifier
            (such as biometric data, aadhar number, social security number,
            driver’s license, passport, etc.,), (iv) information about sexual
            life, sexual identifier, race, ethnicity, political or religious
            belief or affiliation, (v) account details and passwords, or (vi)
            other data/information categorized as ‘sensitive personal data’ or
            ‘special categories of data’ under the Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal
            Data or Information) Rules, 2011, General Data Protection Regulation
            (GDPR) and / or the California Consumer Privacy Act (CCPA) (“Data
            Protection Laws”) and in context of this Policy or other equivalent
            / similar legislations. Usage of the term ‘Personal Information’
            shall include ‘Sensitive Personal Information’ as may be applicable
            to the context of its usage.
            <br /> <br />
            <hr /> <br />
            <br />
            <strong>2. INFORMATION WE COLLECT:</strong>
             <br />
            We may collect both personal and non-personal identifiable
            information from You in a variety of ways, including, but not
            limited to, when You visit our Platform, register on the Platform,
            and in connection with other activities, services, features or
            resources we make available on our Platform. However, please note
            that- We do not ask You for Personal Information unless we truly
            need it; like when You are registering for any Content on the
            Platform. We do not share Your Personal Information with anyone
            except to comply with the applicable laws, develop our products and
            services, or protect our rights. We do not store Personal
            Information on our servers unless required for the on-going
            operation of our Platform.
            <br />  <br /> 
            <strong> a. Personal Identifiable Information:</strong> <br />
            We may collect personal-identifiable information such as Your name
            and emails address to enable Your access to the Platform and
            services/products offered therein. We will collect
            personal-identifiable information from You only if such information
            is voluntarily submitted by You to us. You can always refuse to
            provide such personal identification information; however, it may
            prevent You from accessing services or products provided on the
            Platform or from engaging in certain activities on the Platform.{" "}
            <br /> <br />
            <strong> b. Non-Personal Identifiable Information:</strong> <br />
            When You interact with our Platform, we may collect
            non-personal-identifiable information such as the browser name,
            language preference, referring site, and the date and time of each
            user request, operating system and the Internet service providers
            utilized and other similar information. <br /> <br />
            <strong>c. Cookies:</strong> <br />
            To enhance User experience, our Platform may use 'cookies'. A cookie
            is a string of information that a website stores on a visitor’s
            computer, and that the visitor’s browser provides to the website
            each time the visitor returns for record-keeping purposes. You may
            choose to set Your web browser to refuse cookies, or to notify You
            when cookies are being sent; however, please note that in doing so,
            some parts of the Platform may not function properly.
            <br /> <br />
            Thank you for being a valued user!
          </div>
        </div>

        {isterms=="true" ? (
          <div>
            <div className="flex justify-between items-center mt-6 gap-4">
              <button
                className="btn btn-outline btn-sm"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                onClick={scrollToBottom}
              >
                Scroll to Bottom
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={handleAccept}
                style={{
                  color: theme === "dark" ? "#ffffff" : "black",
                  backgroundColor: "#89C34C",
                }}
              >
                Agree & Continue
              </button>
            </div>
            {/* {!isScrolledToBottom && (
          <p className="text-center text-xs text-red-500 mt-2">
            You must scroll to the bottom to accept.
          </p>
        )}  */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Privacy;
