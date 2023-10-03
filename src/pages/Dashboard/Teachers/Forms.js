import React, { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/Forms.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Forms = () => {
  const [createForm, setCreateForm] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState('First Review'); // Default to First Review
  const navigate = useNavigate();

  const handleCreateFormToggle = () => {
    setCreateForm(!createForm);
  };

  const handleReviewTypeChange = (e) => {
    setSelectedReviewType(e.target.value);
  };

  const handleFormSubmit = async (formData) => {
    // Include the selected review type in the form data
    formData.reviewType = selectedReviewType;

    try {
      const response = await fetch(`${apiUrl}/api/forms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Form saved:', data);

      // Show success notification
      toast.success('Form created successfully!');

      // Reset the createForm state
      setCreateForm(false);

      // Navigate to the evaluation page with the form data as a query parameter
      navigate('/evaluationt', { state: { formData } });
    } catch (error) {
      console.error('Error saving form:', error);

      // Show error notification
      toast.error('Failed to create form');
    }
  };
  return (
    <div className="dft">
      <DashboardNavbar>
        <div className="dfct">
          <div className="form-switch-containertf">
            <label htmlFor="review-type-select" className="custom-label">
              Select Review Type:
            </label>
            <select
              id="review-type-select"
              value={selectedReviewType}
              onChange={handleReviewTypeChange}
              disabled={createForm}
              className="custom-select"
            >
              <option value="">Select</option>
              <option value="First">First Review</option>
              <option value="Second">Second Review</option>
              <option value="Third">Third Review</option>
            </select>
            <label htmlFor="create-form-switch" className="custom-label form-switch-labelt">
              Create New Form
            </label>
            <input
              id="create-form-switch"
              type="checkbox"
              className="form-switch-input custom-checkbox"
              checked={createForm}
              onChange={handleCreateFormToggle}
            />
          </div>
          {createForm ? (
            <FormBuilder onSubmit={handleFormSubmit} />
          ) : (
            <DataTable />
          )}
        </div>
        <ToastContainer />
      </DashboardNavbar>
    </div>

  );
};

const FormBuilder = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    formTitle: '',
    formParameters: [],
    overallTotalMarks: 0, // Initialize the overallTotalMarks field to 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleParameterChange = (index, parameterData) => {
    const updatedParameters = [...formData.formParameters];
    updatedParameters[index] = parameterData;
    setFormData((prevData) => ({ ...prevData, formParameters: updatedParameters }));

    // Recalculate the overallTotalMarks when a parameter is changed
    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );
    setFormData((prevData) => ({ ...prevData, overallTotalMarks }));
  };

  const handleAddParameter = () => {
    const newParameter = {
      parameterTitle: '',
      subParameters: [],
      parameterTotalMarks: 0,
    };
    setFormData((prevData) => ({
      ...prevData,
      formParameters: [...prevData.formParameters, newParameter],
    }));
  };

  const handleRemoveParameter = (index) => {
    const updatedParameters = [...formData.formParameters];
    updatedParameters.splice(index, 1);

    // Recalculate the overallTotalMarks when a parameter is removed
    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleAddSubParameter = (index) => {
    const newSubParameter = {
      subParameterName: '',
      subParameterMaxMarks: '',
      subParameterGivenMarks: '',
    };
    const updatedParameters = [...formData.formParameters];
    updatedParameters[index].subParameters.push(newSubParameter);
    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
    }));
  };

  const handleRemoveSubParameter = (parameterIndex, subParameterIndex) => {
    const updatedParameters = [...formData.formParameters];
    const updatedSubParameters = [...updatedParameters[parameterIndex].subParameters];
    updatedSubParameters.splice(subParameterIndex, 1);
    updatedParameters[parameterIndex].subParameters = updatedSubParameters;

    // Calculate the total marks for the parameter based on given marks for each sub-parameter
    let totalMarks = 0;
    updatedSubParameters.forEach((subParameter) => {
      if (!isNaN(subParameter.subParameterMaxMarks)) {
        totalMarks += parseInt(subParameter.subParameterMaxMarks);
      }
    });

    // Update the total marks for the parameter
    updatedParameters[parameterIndex].parameterTotalMarks = totalMarks;

    // Recalculate the overallTotalMarks when a subparameter is removed
    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleSubParameterChange = (parameterIndex, subParameterIndex, subParameterData) => {
    const updatedParameters = [...formData.formParameters];
    const updatedSubParameters = [...updatedParameters[parameterIndex].subParameters];
    updatedSubParameters[subParameterIndex] = subParameterData;
    updatedParameters[parameterIndex].subParameters = updatedSubParameters;

    // Calculate the total marks for the parameter based on given marks for each sub-parameter
    let totalMarks = 0;
    updatedSubParameters.forEach((subParameter) => {
      if (!isNaN(subParameter.subParameterMaxMarks)) {
        totalMarks += parseInt(subParameter.subParameterMaxMarks);
      }
    });

    // Update the total marks for the parameter
    updatedParameters[parameterIndex].parameterTotalMarks = totalMarks;

    // Recalculate the overallTotalMarks when a subparameter is changed
    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Call the onSubmit callback with the form data
    onSubmit(formData);
  };

  return (
    <div className="form-buildertf">
      <h2>Evaluation Parameters</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-fieldtf">
          <label htmlFor="form-title-input">Form Title:</label>
          <input
            type="text"
            id="form-title-input"
            name="formTitle"
            value={formData.formTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-columnst">
          <div className="form-columntf">
            <div className="form-headertf">Parameter Title</div>
            {formData.formParameters.map((parameter, index) => (
              <ParameterField
                key={index}
                index={index}
                parameter={parameter}
                onParameterChange={handleParameterChange}
                onAddSubParameter={handleAddSubParameter}
                onRemoveParameter={handleRemoveParameter}
                onSubParameterChange={handleSubParameterChange}
                onRemoveSubParameter={handleRemoveSubParameter}
              />
            ))}
          </div>
        </div>
        <div className="overall-total-marks-rowtf">
          <label htmlFor="overall-total-marks-input">Overall Total Marks:</label>
          <input
            type="number"
            id="overall-total-marks-input"
            name="overallTotalMarks"
            value={formData.overallTotalMarks || ''}
            readOnly // Disable editing of the overall total marks input field
          />
        </div>
        <button type="button" className="add-parameter-buttontf" onClick={handleAddParameter}>
          Add Parameter
        </button>
        <button type="submit" className="submit-buttontf">Submit</button>
      </form>
    </div>
  );
};

const ParameterField = ({ index, parameter, onParameterChange, onAddSubParameter, onRemoveParameter, onSubParameterChange, onRemoveSubParameter }) => {
  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    onParameterChange(index, { ...parameter, [name]: value });
  };

  return (
    <div className="parameter-fieldtf">
      <div className="parameter-title-rowtf">
        <label htmlFor={`parameter-title-input-${index}`}>Parameter Title:</label>
        <input
          type="text"
          id={`parameter-title-input-${index}`}
          name="parameterTitle"
          value={parameter.parameterTitle}
          onChange={handleParameterChange}
        />
        <button type="button" className="remove-parameter-buttontf" onClick={() => onRemoveParameter(index)}>
          Remove Parameter
        </button>
      </div>
      {parameter.subParameters.map((subParameter, subIndex) => (
        <SubParameterField
          key={subIndex}
          parameterIndex={index}
          subParameterIndex={subIndex}
          subParameter={subParameter}
          onSubParameterChange={onSubParameterChange}
          onRemoveSubParameter={onRemoveSubParameter}
        />
      ))}
      <div className="total-marks-rowtf">
        <label htmlFor={`parameter-total-marks-input-${index}`}>Total Marks:</label>
        <input
          type="number"
          id={`parameter-total-marks-input-${index}`}
          name="parameterTotalMarks"
          value={parameter.parameterTotalMarks || ''}
          readOnly // Disable editing of the total marks input field
        />
      </div>
      <button type="button" className="add-sub-parameter-buttontf" onClick={() => onAddSubParameter(index)}>
        Add Sub Parameter
      </button>
    </div>
  );
};

const SubParameterField = ({ parameterIndex, subParameterIndex, subParameter, onSubParameterChange, onRemoveSubParameter }) => {
  const handleSubParameterChange = (e) => {
    const { name, value } = e.target;
    onSubParameterChange(parameterIndex, subParameterIndex, { ...subParameter, [name]: value });
  };

  return (
    <div className="sub-parameter-fieldtf">
      <label htmlFor={`subparameter-name-input-${parameterIndex}-${subParameterIndex}`}>Sub Parameter Name:</label>
      <input
        type="text"
        id={`subparameter-name-input-${parameterIndex}-${subParameterIndex}`}
        name="subParameterName"
        value={subParameter.subParameterName}
        onChange={handleSubParameterChange}
      />
      <label htmlFor={`subparameter-max-marks-input-${parameterIndex}-${subParameterIndex}`}>Max Marks:</label>
      <input
        type="number"
        id={`subparameter-max-marks-input-${parameterIndex}-${subParameterIndex}`}
        name="subParameterMaxMarks"
        value={subParameter.subParameterMaxMarks}
        onChange={handleSubParameterChange}
      />
      <label htmlFor={`subparameter-given-marks-input-${parameterIndex}-${subParameterIndex}`}>Given Marks:</label>
      <input
        type="number"
        id={`subparameter-given-marks-input-${parameterIndex}-${subParameterIndex}`}
        name="subParameterGivenMarks"
        value={subParameter.subParameterGivenMarks}
        onChange={handleSubParameterChange}
      />
      <button type="button" className="remove-sub-parameter-button" onClick={() => onRemoveSubParameter(parameterIndex, subParameterIndex)}>
        Remove Sub Parameter
      </button>
    </div>
  );
};

const DataTable = () => {
  // Render table with data fetched from the backend database
  return (
    <div className="data-table">
      <h2>Form Data Table Creation</h2>
      <p className="form-description">Create New Form: By toggling the "Create New Form" switch, users can start building a new evaluation form. When the switch is turned on, it reveals a dynamic form creation interface.</p>
      <p className="form-description">Add Parameters: Within the form creation interface, users can add multiple evaluation parameters. Each parameter consists of a "Parameter Title" field. Users can click the "Add Parameter" button to include additional parameters as needed.</p>
      <p className="form-description">Add Sub-Parameters: For each parameter, users can add sub-parameters, if required. Sub-parameters have attributes like "Sub Parameter Name," "Max Marks," and "Given Marks." Sub-parameters are useful for breaking down complex evaluation criteria into smaller components.</p>
      <p className="form-description">Overall Total Marks Calculation: The system automatically calculates and displays the overall total marks based on the sub-parameter input values. This ensures that users can see the total possible marks for the entire form.</p>
      <p className="form-description">Form Title: Users must provide a title for the form.</p>
    </div>
  );
};

export default Forms;
