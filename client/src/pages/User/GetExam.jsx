import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import './GetExam.css'; // custom css

const GetExam = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/exams/exam/${examId}`);
        const { exam: examData, questions: questionData } = res.data;
        setExam(examData);
        setQuestions(questionData);
        setTimeLeft(parseInt(examData.duration) * 60);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(err.response?.data?.error || 'Failed to load exam');
      }
    };
    fetchExam();
  }, [examId]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted || !testStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, testStarted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    if (!testStarted) setTestStarted(true);
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    try {
      const res = await axios.post('http://localhost:5000/api/exams/submit-exam', {
        examId,
        answers,
        email,
      });
      setResult(res.data);
      setSubmitted(true);
      alert('Your Exam was submitted successfully ✅');
      navigate('/userdash/profile');
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError(err.response?.data?.error || 'Failed to submit exam');
    }
  };

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  if (!exam || !questions.length) {
    return <div className="text-center m-4">Loading...</div>;
  }

  return (
    <div className="exam-container container my-4">
      {/* Sticky timer */}
      <div className="sticky-timer shadow-sm">
        ⏰ Time Left: <span className="fw-bold text-danger">{formatTime(timeLeft)}</span>
      </div>

      {/* Exam Info */}
      <div className="card shadow exam-info mb-4">
        <div className="card-body">
          <h2 className="exam-title">{exam.title}</h2>
          <div className="row text-center mt-3">
            <div className="col-md-4"><strong>Duration:</strong> {exam.duration} mins</div>
            <div className="col-md-4"><strong>Total Marks:</strong> {exam.totalMarks}</div>
            <div className="col-md-4"><strong>Passing Marks:</strong> {exam.passingMarks}</div>
          </div>
        </div>
      </div>

      {submitted && result ? (
        <div className="card shadow p-4">
          <h4 className="mb-3">📊 Exam Results</h4>
          <p><strong>Score:</strong> {result.score} / {result.totalMarks}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${result.passed ? 'bg-success' : 'bg-danger'}`}>
              {result.passed ? 'Passed ✅' : 'Failed ❌'}
            </span>
          </p>
          <h5 className="mt-4">Answer Details:</h5>
          <ul className="list-group">
            {result.results.map((res, index) => (
              <li key={index} className="list-group-item">
                <strong>Q{index + 1}:</strong> {res.question}<br />
                <span className="text-primary">Your Answer: {res.selectedAnswer || 'Not answered'}</span><br />
                <span className="text-success">Correct Answer: {res.correctAnswer}</span><br />
                <span className={res.isCorrect ? 'text-success' : 'text-danger'}>
                  {res.isCorrect ? '✔ Correct' : '✘ Incorrect'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {!testStarted && (
            <div className="alert alert-warning">
              ⚠ Please start the test by selecting an answer. The test will expire soon if not started.
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {questions.map((q, index) => (
              <div key={q._id} className="card shadow-sm mb-3 question-card">
                <div className="card-body">
                  <h5 className="question-text">Q{index + 1}: {q.question}</h5>
                  {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, i) => (
                    <div className="form-check option-item" key={i}>
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => handleAnswerChange(q._id, opt)}
                        className="form-check-input"
                        id={`opt-${q._id}-${i}`}
                        disabled={submitted}
                      />
                      <label className="form-check-label option-label" htmlFor={`opt-${q._id}-${i}`}>
                        {opt}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-lg btn-primary px-5" disabled={submitted}>
                🚀 Submit Exam
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default GetExam;
