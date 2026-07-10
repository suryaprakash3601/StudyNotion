import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../../services/apiConnector";
import { courseEndpoints } from "../../../services/api";
import toast from "react-hot-toast";

/**
 * CourseCertificate
 * Fetches certificate data from the backend and renders a printable/downloadable
 * certificate card. Uses the browser's print API for PDF export.
 */
export default function CourseCertificate() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const certRef = useRef(null);

  useEffect(() => {
    async function fetchCert() {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `${courseEndpoints.CERTIFICATE_GENERATE_API}`,
          null,
          { Authorization: `Bearer ${token}` },
          { courseId }
        );
        if (response?.data?.success) {
          setCert(response.data.certificate);
        } else {
          setError(response?.data?.message || "Could not generate certificate");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Could not generate certificate. Ensure you have completed the course."
        );
      } finally {
        setLoading(false);
      }
    }
    if (courseId && token) fetchCert();
  }, [courseId, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(cert.certId);
    toast.success("Certificate ID copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-white px-4">
        <p className="text-2xl font-semibold text-yellow-400">Certificate Not Available</p>
        <p className="text-richblack-300 text-center max-w-md">{error}</p>
        <p className="text-richblack-400 text-sm">
          Complete all lectures in the course to earn your certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Action buttons — hidden when printing */}
      <div className="flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="yellowButton px-6 py-2 font-semibold"
        >
          Download / Print Certificate
        </button>
        <button
          onClick={handleCopyId}
          className="blackButton px-6 py-2 font-semibold"
        >
          Copy Certificate ID
        </button>
      </div>

      {/* Certificate card */}
      <div
        ref={certRef}
        className="certificate-card relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "Georgia, serif", minHeight: "600px" }}
      >
        {/* Decorative top border */}
        <div className="h-3 w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300" />

        {/* Inner content with decorative border */}
        <div className="m-8 border-4 border-yellow-400 rounded-xl p-10 flex flex-col items-center gap-6 text-center">
          {/* Logo / Platform name */}
          <p className="text-4xl font-extrabold tracking-widest text-richblack-900 uppercase"
            style={{ letterSpacing: "0.2em" }}>
            StudyNotion
          </p>
          <p className="text-sm tracking-[0.3em] uppercase text-yellow-600 font-semibold">
            Certificate of Completion
          </p>

          <div className="w-24 h-px bg-yellow-400 my-2" />

          <p className="text-lg text-gray-500">This is to certify that</p>

          <p className="text-4xl font-bold text-richblack-900 py-2" style={{ fontFamily: "'Times New Roman', serif" }}>
            {cert.studentName}
          </p>

          <p className="text-lg text-gray-500">has successfully completed the course</p>

          <p className="text-2xl font-semibold text-richblack-800 italic py-1">
            "{cert.courseTitle}"
          </p>

          <p className="text-base text-gray-500">
            instructed by <span className="font-semibold text-richblack-700">{cert.instructorName}</span>
          </p>

          <div className="w-24 h-px bg-yellow-400 my-2" />

          {/* Footer row */}
          <div className="flex w-full justify-between items-end mt-4 flex-wrap gap-4">
            <div className="text-left">
              <p className="text-xs text-gray-400">Date Issued</p>
              <p className="text-sm font-semibold text-richblack-700">{cert.completionDate}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-yellow-50">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Certificate ID</p>
              <p className="text-sm font-mono font-semibold text-richblack-700 tracking-wider">
                {cert.certId}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Issued by {cert.issuedBy} · Verify at studynotion.com/verify · {cert.totalLectures} lectures completed
          </p>
        </div>

        {/* Decorative bottom border */}
        <div className="h-3 w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400" />
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-card, .certificate-card * { visibility: visible; }
          .certificate-card { position: fixed; top: 0; left: 0; width: 100vw; }
        }
      `}</style>
    </div>
  );
}
