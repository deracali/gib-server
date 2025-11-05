import Application from "../model/ApplicationModel.js";

// CREATE
export const createApplication = async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);


  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
     return res.status(400).json({
       message: "Email already exists",
       error: `The email '${error.keyValue.email}' is already used for an application.`,
     });
   }
    res.status(500).json({ message: "Error creating application", error: error.message });
  }
};

// READ ALL
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
};

// READ ONE
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Error fetching application", error: error.message });
  }
};

// UPDATE
export const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Error updating application", error: error.message });
  }
};

// DELETE
export const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application", error: error.message });
  }
};



// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId } = req.body;

    if (typeof paymentStatus !== "boolean") {
      return res.status(400).json({
        message: "paymentStatus must be a boolean value (true or false)",
      });
    }

    const updateData = { paymentStatus };
    if (transactionId) {
      updateData.transactionId = transactionId; // add transactionId if provided
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      application: updatedApp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating payment status",
      error: error.message,
    });
  }
};




// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus } = req.body;

    // ✅ Validate status
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(applicationStatus)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}`,
      });
    }

    // ✅ Update only the status field
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { applicationStatus },
      { new: true, runValidators: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: `Application status updated to '${applicationStatus}'`,
      application: updatedApp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating application status",
      error: error.message,
    });
  }
};
