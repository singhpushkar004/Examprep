import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionBank = () => {
  const [formData, setFormdata] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    subject: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [id, setId] = useState({ id: '' });
  const [editform, setEditForm] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(""); // search state
  const [perPage, setPerPage] = useState(5); // items per page
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editform) {
        const res = await axios.put(`http://localhost:5000/api/question/${id.id}`, formData);
        if (res) {
          alert('Question updated successfully');
        }
      } else {
        const res = await axios.post('http://localhost:5000/api/question', formData);
        if (res) {
          alert('Question added successfully');
        }
      }

      setFormdata({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        subject: "",
      });
      setEditForm(false);
      setId({ id: '' });
      handlefetch();
    } catch (err) {
      console.log(err);
      alert("Sorry, try again later");
    }
  };

  const handlefetch = async () => {
    const res = await axios.get('http://localhost:5000/api/question');
    setData(res.data.data);

    const res1 = await axios.get('http://localhost:5000/api/subject');
    setSubjects(res1.data.data);
  };

  useEffect(() => {
    handlefetch();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/question/${id}`);
      if (res) {
        alert("Deleted Successfully");
        handlefetch();
      }
    } catch (err) {
      alert("Try Again Later");
    }
  };

  const handleEdit = (q) => {
    setFormdata({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      subject: q.subject?._id || "",
    });
    setId({ id: q._id });
    setEditForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔎 Filter data by search keyword
  const filteredData = data.filter(q => {
    const keyword = search.toLowerCase();
    return (
      q.question.toLowerCase().includes(keyword) ||
      q.optionA.toLowerCase().includes(keyword) ||
      q.optionB.toLowerCase().includes(keyword) ||
      q.optionC.toLowerCase().includes(keyword) ||
      q.optionD.toLowerCase().includes(keyword) ||
      q.correctAnswer.toLowerCase().includes(keyword) ||
      (q.subject?.subjectname?.toLowerCase().includes(keyword))
    );
  });

  // 📑 Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / perPage);

  return (
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col-sm-12">
          <div className="card" style={{ border: "1px solid #6f42c1", minHeight: "220px", width: "100%" }}>
            <form onSubmit={handleSubmit} className="border p-2 rounded">
              <div className="row">
                <div className="col-sm-12 ">
                  <h5 className="fw-bold" style={{ color: "#6f42c1" }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: "8px" }}></i>
                    {editform ? 'Edit Question' : 'Add Question'}
                  </h5>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <h5 className="mt-1">Question</h5>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter Question Here"
                  ></textarea>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm-6">
                  <input type="text" name="optionA" placeholder="a.) Option 1" className="form-control" value={formData.optionA} onChange={handleChange} required />
                </div>
                <div className="col-sm-6">
                  <input type="text" name="optionB" placeholder="b.) Option 2" className="form-control" value={formData.optionB} onChange={handleChange} required />
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm-6">
                  <input type="text" name="optionC" placeholder="c.) Option 3" className="form-control" value={formData.optionC} onChange={handleChange} required />
                </div>
                <div className="col-sm-6">
                  <input type="text" name="optionD" placeholder="d.) Option 4" className="form-control" value={formData.optionD} onChange={handleChange} required />
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm-6">
                  <input name="correctAnswer" className="form-control" placeholder="Correct Option" value={formData.correctAnswer} onChange={handleChange} required />
                </div>
                <div className="col-sm-6">
                  <select name="subject" value={formData.subject} onChange={handleChange} className="form-select" required>
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.subjectname}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-light text-white mt-1" style={{ background: "#39064fff " }}>
                {editform ? "Update Question" : "Add Question"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="card mx-auto mt-2" style={{ border: "1px solid #6f42c1", width: "100%" }}>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-sm-6">
              <h3 className="fw-bold" style={{ color: "#6f42c1" }}>Question List</h3>
            </div>
            <div className="col-sm-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-sm-3">
              <select className="form-select" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
              </select>
            </div>
          </div>

          <table className="table table-bordered text-center">
            <thead className="thead-light-purple">
              <tr>
                <th>S.No.</th>
                <th>Question</th>
                <th>Subject</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
                <th>Correct Option</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((q, index) => (
                  <tr key={q._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{q.question}</td>
                    <td>{q.subject?.subjectname}</td>
                    <td>{q.optionA}</td>
                    <td>{q.optionB}</td>
                    <td>{q.optionC}</td>
                    <td>{q.optionD}</td>
                    <td>{q.correctAnswer}</td>
                    <td>
                      <button className="btn-edit me-2" onClick={() => handleEdit(q)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(q._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
