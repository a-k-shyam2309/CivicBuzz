document.addEventListener("DOMContentLoaded", () => {

	/* =====================================================
	   ELEMENTS
	===================================================== */

	const issueSearch =
		document.getElementById("issueSearch");

	const searchButton =
		document.getElementById("searchButton");

	const statusFilter =
		document.getElementById("statusFilter");

	const priorityFilter =
		document.getElementById("priorityFilter");

	const categoryFilter =
		document.getElementById("categoryFilter");

	const dateFilter =
		document.getElementById("dateFilter");

	const tableBody =
		document.getElementById("issuesTableBody");


	/* =====================================================
	   RIGHT SIDE ISSUE PANEL
	===================================================== */

	const issuePanel =
		document.getElementById("issueDetailsPanel");

	const issuePanelOverlay =
		document.getElementById("issuePanelOverlay");

	const closeIssuePanel =
		document.getElementById("closeIssuePanel");


	/* =====================================================
	   PANEL ELEMENTS
	===================================================== */

	const panelIssueId =
		document.getElementById("panelIssueId");

	const panelIssueTitle =
		document.getElementById("panelIssueTitle");

	const panelUserId =
		document.getElementById("panelUserId");

	const panelDate =
		document.getElementById("panelDate");

	const panelLocation =
		document.getElementById("panelLocation");

	const panelCategory =
		document.getElementById("panelCategory");

	const panelPriority =
		document.getElementById("panelPriority");

	const panelStatus =
		document.getElementById("panelStatus");

	const panelAssigned =
		document.getElementById("panelAssigned");

	const panelDescription =
		document.getElementById("panelDescription");


	/* =====================================================
	   IMAGE ELEMENTS
	===================================================== */

	const panelImageContainer =
		document.getElementById("panelImageContainer");

	const panelIssueImage =
		document.getElementById("panelIssueImage");

	const noImageMessage =
		document.getElementById("noImageMessage");


	/* =====================================================
	   STATUS SELECT
	===================================================== */

	const panelStatusSelect =
		document.getElementById("panelStatusSelect");


	/* =====================================================
	   ACTION BUTTONS
	===================================================== */

	const assignIssueBtn =
		document.getElementById("assignIssueBtn");

	const rejectIssueBtn =
		document.getElementById("rejectIssueBtn");

	const resolveIssueBtn =
		document.getElementById("resolveIssueBtn");


	/* =====================================================
	   STATUS NAMES
	===================================================== */

	const statusNames = {

		pending: "Pending",

		progress: "In Progress",

		resolved: "Resolved",

		closed: "Closed",

		rejected: "Rejected"

	};


	/* =====================================================
	   PRIORITY NAMES
	===================================================== */

	const priorityNames = {

		low: "Low",

		medium: "Medium",

		high: "High",

		critical: "Critical"

	};


	/* =====================================================
	   SAMPLE ISSUE DATA
	===================================================== */

	const issueData = {

		"ISS-1024": {

			id: "ISS-1024",

			title: "Street Light Not Working",

			userId: "USR-2045",

			date: "18 Aug 2026, 10:30 AM",

			location: "Sakchi, Jamshedpur",

			category: "Electricity",

			priority: "high",

			status: "pending",

			assigned: "Municipal Electricity Team",

			description:
				"Street light near Sakchi Market has not been working for the last 3 days. Please fix it as soon as possible.",

			image: ""

		},


		"ISS-1023": {

			id: "ISS-1023",

			title: "Garbage Not Collected",

			userId: "USR-1821",

			date: "17 Aug 2026, 04:20 PM",

			location: "Bistupur, Jamshedpur",

			category: "Garbage",

			priority: "medium",

			status: "progress",

			assigned: "Sanitation Department",

			description:
				"Garbage has not been collected from the area for the last two days.",

			image: ""

		},


		"ISS-1022": {

			id: "ISS-1022",

			title: "Road Damage",

			userId: "USR-1942",

			date: "17 Aug 2026, 11:45 AM",

			location: "Mango, Jamshedpur",

			category: "Road",

			priority: "critical",

			status: "resolved",

			assigned: "Road Maintenance Team",

			description:
				"A large damaged section of the road is creating problems for vehicles and pedestrians.",

			image: ""

		},


		"ISS-1021": {

			id: "ISS-1021",

			title: "Water Leakage",

			userId: "USR-1654",

			date: "16 Aug 2026, 09:15 AM",

			location: "Sonari, Jamshedpur",

			category: "Water",

			priority: "medium",

			status: "pending",

			assigned: "Water Supply Department",

			description:
				"Water is leaking continuously from a damaged pipeline near the residential area.",

			image: ""

		},


		"ISS-1020": {

			id: "ISS-1020",

			title: "Overflowing Drain",

			userId: "USR-1532",

			date: "16 Aug 2026, 08:40 AM",

			location: "Kadma, Jamshedpur",

			category: "Drainage",

			priority: "medium",

			status: "progress",

			assigned: "Drainage Department",

			description:
				"The drainage line is overflowing and causing water to accumulate on the road.",

			image: ""

		},


		"ISS-1019": {

			id: "ISS-1019",

			title: "Broken Footpath",

			userId: "USR-2011",

			date: "15 Aug 2026, 03:10 PM",

			location: "Telco, Jamshedpur",

			category: "Road",

			priority: "low",

			status: "resolved",

			assigned: "Road Maintenance Team",

			description:
				"The footpath is broken and needs repair for pedestrian safety.",

			image: ""

		},


		"ISS-1018": {

			id: "ISS-1018",

			title: "Water Supply Issue",

			userId: "USR-1776",

			date: "15 Aug 2026, 01:25 PM",

			location: "Adityapur",

			category: "Water",

			priority: "high",

			status: "pending",

			assigned: "Water Supply Department",

			description:
				"Residents are facing irregular water supply in the area.",

			image: ""

		},


		"ISS-1017": {

			id: "ISS-1017",

			title: "Garbage Bin Full",

			userId: "USR-1888",

			date: "14 Aug 2026, 05:30 PM",

			location: "Sakchi, Jamshedpur",

			category: "Garbage",

			priority: "low",

			status: "resolved",

			assigned: "Sanitation Department",

			description:
				"The public garbage bin was completely full and required immediate collection.",

			image: ""

		}

	};


	/* =====================================================
	   CURRENT ISSUE
	===================================================== */

	let currentIssueId = null;


	/* =====================================================
	   OPEN ISSUE PANEL
	===================================================== */

	function openIssuePanel(issueId) {

		const issue = issueData[issueId];

		if (!issue) {

			console.warn(
				"Issue not found:",
				issueId
			);

			return;
		}


		currentIssueId = issueId;


		/* ---------------------------------------------
		   BASIC INFORMATION
		--------------------------------------------- */

		if (panelIssueId) {

			panelIssueId.textContent =
				`#${issue.id}`;

		}


		if (panelIssueTitle) {

			panelIssueTitle.textContent =
				issue.title;

		}


		if (panelUserId) {

			panelUserId.textContent =
				issue.userId;

		}


		if (panelDate) {

			panelDate.textContent =
				issue.date;

		}


		if (panelLocation) {

			panelLocation.textContent =
				issue.location;

		}


		if (panelCategory) {

			panelCategory.textContent =
				issue.category;

		}


		if (panelAssigned) {

			panelAssigned.textContent =
				issue.assigned;

		}


		if (panelDescription) {

			panelDescription.textContent =
				issue.description;

		}


		/* ---------------------------------------------
		   PRIORITY
		--------------------------------------------- */

		if (panelPriority) {

			panelPriority.textContent =
				priorityNames[issue.priority] ||
				issue.priority;

			panelPriority.className =
				"priority " + issue.priority;

		}


		/* ---------------------------------------------
		   STATUS
		--------------------------------------------- */

		if (panelStatus) {

			panelStatus.textContent =
				statusNames[issue.status] ||
				issue.status;

			panelStatus.className =
				"status " + issue.status;

		}


		/* ---------------------------------------------
		   STATUS SELECT
		--------------------------------------------- */

		if (panelStatusSelect) {

			panelStatusSelect.value =
				issue.status;

		}


		/* ---------------------------------------------
		   IMAGE HANDLING
		--------------------------------------------- */

		updatePanelImage(issue.image);


		/* ---------------------------------------------
		   OPEN PANEL
		--------------------------------------------- */

		if (issuePanel) {

			issuePanel.classList.add(
				"active"
			);

		}


		if (issuePanelOverlay) {

			issuePanelOverlay.classList.add(
				"active"
			);

		}


		document.body.style.overflow =
			"hidden";

	}

	/* =====================================================
   IMAGE HANDLING
===================================================== */

	function updatePanelImage(imageSource) {

		if (
			imageSource &&
			typeof imageSource === "string" &&
			imageSource.trim() !== ""
		) {

			/* ---------------------------------------------
			   IMAGE AVAILABLE
			--------------------------------------------- */

			if (panelIssueImage) {

				panelIssueImage.src =
					imageSource;

				panelIssueImage.alt =
					"Reported issue image";

				panelIssueImage.style.display =
					"block";

			}


			if (noImageMessage) {

				noImageMessage.style.display =
					"none";

			}

		} else {

			/* ---------------------------------------------
			   NO IMAGE AVAILABLE
			--------------------------------------------- */

			if (panelIssueImage) {

				panelIssueImage.removeAttribute(
					"src"
				);

				panelIssueImage.alt =
					"";

				panelIssueImage.style.display =
					"none";

			}


			if (noImageMessage) {

				noImageMessage.style.display =
					"flex";

			}

		}

	}


	/* =====================================================
	   IMAGE ERROR HANDLING
	   If image URL exists but image fails to load
	===================================================== */

	if (panelIssueImage) {

		panelIssueImage.addEventListener(
			"error",
			() => {

				panelIssueImage.style.display =
					"none";


				if (noImageMessage) {

					noImageMessage.style.display =
						"flex";

				}

			}
		);

	}


	/* =====================================================
	   CLOSE ISSUE PANEL
	===================================================== */

	function closeIssueDetailsPanel() {

		if (issuePanel) {

			issuePanel.classList.remove(
				"active"
			);

		}


		if (issuePanelOverlay) {

			issuePanelOverlay.classList.remove(
				"active"
			);

		}


		document.body.style.overflow =
			"";


		currentIssueId = null;

	}


	/* =====================================================
	   CLOSE BUTTON
	===================================================== */

	if (closeIssuePanel) {

		closeIssuePanel.addEventListener(
			"click",
			closeIssueDetailsPanel
		);

	}


	/* =====================================================
	   OVERLAY CLICK
	===================================================== */

	if (issuePanelOverlay) {

		issuePanelOverlay.addEventListener(
			"click",
			closeIssueDetailsPanel
		);

	}


	/* =====================================================
	   ESCAPE KEY
	===================================================== */

	document.addEventListener(
		"keydown",
		event => {

			if (
				event.key === "Escape" &&
				issuePanel &&
				issuePanel.classList.contains(
					"active"
				)
			) {

				closeIssueDetailsPanel();

			}

		}
	);


	/* =====================================================
	   VIEW ISSUE BUTTONS
	===================================================== */

	function attachViewButtons() {

		const viewButtons =
			document.querySelectorAll(
				".view-issue-btn"
			);


		viewButtons.forEach(button => {

			button.addEventListener(
				"click",
				() => {

					const issueId =
						button.dataset.issueId;


					openIssuePanel(
						issueId
					);

				}
			);

		});

	}


	attachViewButtons();


	/* =====================================================
	   SEARCH FUNCTION
	===================================================== */

	function filterIssues() {

		const searchValue =
			issueSearch
				? issueSearch.value
					.trim()
					.toLowerCase()
				: "";


		const selectedStatus =
			statusFilter
				? statusFilter.value
				: "all";


		const selectedPriority =
			priorityFilter
				? priorityFilter.value
				: "all";


		const selectedCategory =
			categoryFilter
				? categoryFilter.value
				: "all";


		const rows =
			tableBody
				? tableBody.querySelectorAll("tr")
				: [];


		rows.forEach(row => {

			const rowText =
				row.textContent
					.toLowerCase();


			const rowStatus =
				row.dataset.status;


			const rowPriority =
				row.dataset.priority;


			const rowCategory =
				row.dataset.category;


			/* Search */

			const matchesSearch =
				searchValue === "" ||
				rowText.includes(
					searchValue
				);


			/* Status */

			const matchesStatus =
				selectedStatus === "all" ||
				rowStatus === selectedStatus;


			/* Priority */

			const matchesPriority =
				selectedPriority === "all" ||
				rowPriority === selectedPriority;


			/* Category */

			const matchesCategory =
				selectedCategory === "all" ||
				rowCategory === selectedCategory;


			const shouldShow =
				matchesSearch &&
				matchesStatus &&
				matchesPriority &&
				matchesCategory;


			row.style.display =
				shouldShow ? "" : "none";

		});


		updateVisibleIssueCount();

	}


	/* =====================================================
	   SEARCH EVENTS
	===================================================== */

	if (issueSearch) {

		issueSearch.addEventListener(
			"input",
			filterIssues
		);

	}


	if (searchButton) {

		searchButton.addEventListener(
			"click",
			filterIssues
		);

	}


	/* =====================================================
	   FILTER EVENTS
	===================================================== */

	if (statusFilter) {

		statusFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (priorityFilter) {

		priorityFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (categoryFilter) {

		categoryFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	if (dateFilter) {

		dateFilter.addEventListener(
			"change",
			filterIssues
		);

	}


	/* =====================================================
	   UPDATE VISIBLE ISSUE COUNT
	===================================================== */

	function updateVisibleIssueCount() {

		if (!tableBody) {
			return;
		}


		const rows =
			Array.from(
				tableBody.querySelectorAll("tr")
			);


		const visibleRows =
			rows.filter(
				row =>
					row.style.display !== "none"
			);


		const issueCount =
			document.querySelector(
				".issue-count"
			);


		if (issueCount) {

			issueCount.textContent =
				`Showing ${visibleRows.length} of ${rows.length} visible issues`;

		}

	}


	/* =====================================================
	   UPDATE TABLE STATUS
	===================================================== */

	function updateTableStatus(
		issueId,
		newStatus
	) {

		const viewButton =
			document.querySelector(
				`.view-issue-btn[data-issue-id="${issueId}"]`
			);


		if (!viewButton) {
			return;
		}


		const row =
			viewButton.closest("tr");


		if (!row) {
			return;
		}


		/* Update row dataset */

		row.dataset.status =
			newStatus;


		/* Find badge */

		const statusBadge =
			row.querySelector(
				".status"
			);


		if (statusBadge) {

			statusBadge.textContent =
				statusNames[newStatus] ||
				newStatus;


			statusBadge.className =
				"status " + newStatus;

		}

	}


	/* =====================================================
	   UPDATE PANEL STATUS
	===================================================== */

	function updatePanelStatus(
		newStatus
	) {

		if (!panelStatus) {
			return;
		}


		panelStatus.textContent =
			statusNames[newStatus] ||
			newStatus;


		panelStatus.className =
			"status " + newStatus;

	}


	/* =====================================================
	   STATUS SELECT CHANGE
	===================================================== */

	if (panelStatusSelect) {

		panelStatusSelect.addEventListener(
			"change",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const newStatus =
					panelStatusSelect.value;


				issue.status =
					newStatus;


				updatePanelStatus(
					newStatus
				);


				updateTableStatus(
					currentIssueId,
					newStatus
				);

			}
		);

	}
	/* =====================================================
   ASSIGN ISSUE
===================================================== */

	if (assignIssueBtn) {

		assignIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const newTeam =
					prompt(
						"Enter the team/person to assign this issue:",
						issue.assigned
					);


				if (
					newTeam === null ||
					newTeam.trim() === ""
				) {

					return;

				}


				issue.assigned =
					newTeam.trim();


				if (panelAssigned) {

					panelAssigned.textContent =
						issue.assigned;

				}


				alert(
					`Issue #${issue.id} assigned to ${issue.assigned}.`
				);

			}
		);

	}


	/* =====================================================
	   REJECT ISSUE
	===================================================== */

	if (rejectIssueBtn) {

		rejectIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const confirmed =
					confirm(
						`Are you sure you want to reject #${issue.id}?`
					);


				if (!confirmed) {
					return;
				}


				issue.status =
					"rejected";


				if (panelStatusSelect) {

					panelStatusSelect.value =
						"rejected";

				}


				updatePanelStatus(
					"rejected"
				);


				updateTableStatus(
					issue.id,
					"rejected"
				);


				alert(
					`Issue #${issue.id} has been rejected.`
				);

			}
		);

	}


	/* =====================================================
	   RESOLVE ISSUE
	===================================================== */

	if (resolveIssueBtn) {

		resolveIssueBtn.addEventListener(
			"click",
			() => {

				if (!currentIssueId) {
					return;
				}


				const issue =
					issueData[currentIssueId];


				if (!issue) {
					return;
				}


				const confirmed =
					confirm(
						`Mark #${issue.id} as resolved?`
					);


				if (!confirmed) {
					return;
				}


				issue.status =
					"resolved";


				if (panelStatusSelect) {

					panelStatusSelect.value =
						"resolved";

				}


				updatePanelStatus(
					"resolved"
				);


				updateTableStatus(
					issue.id,
					"resolved"
				);


				alert(
					`Issue #${issue.id} has been marked as resolved.`
				);

			}
		);

	}


	/* =====================================================
	   PAGINATION
	===================================================== */

	const paginationButtons =
		document.querySelectorAll(
			".page-btn"
		);


	paginationButtons.forEach(
		button => {

			button.addEventListener(
				"click",
				() => {

					if (
						button.classList.contains(
							"prev"
						) ||
						button.classList.contains(
							"next"
						)
					) {

						return;

					}


					paginationButtons.forEach(
						page => {

							page.classList.remove(
								"active"
							);

						}
					);


					button.classList.add(
						"active"
					);

				}
			);

		}
	);


	/* =====================================================
	   NOTIFICATION BUTTON
	===================================================== */

	const notificationButton =
		document.querySelector(
			".notification-btn"
		);


	if (notificationButton) {

		notificationButton.addEventListener(
			"click",
			() => {

				alert(
					"You have 3 new notifications."
				);

			}
		);

	}


	/* =====================================================
	   ADMIN PROFILE
	===================================================== */

	const profileDropdown =
		document.querySelector(
			".profile-dropdown"
		);


	if (profileDropdown) {

		profileDropdown.addEventListener(
			"click",
			() => {

				alert(
					"Admin profile menu"
				);

			}
		);

	}


	/* =====================================================
	   DEFAULT FILTER VALUES
	===================================================== */

	if (issueSearch) {

		issueSearch.value = "";

	}


	if (statusFilter) {

		statusFilter.value =
			"all";

	}


	if (priorityFilter) {

		priorityFilter.value =
			"all";

	}


	if (categoryFilter) {

		categoryFilter.value =
			"all";

	}


	if (dateFilter) {

		dateFilter.value =
			"month";

	}


	/* =====================================================
	   INITIAL FILTER
	===================================================== */

	filterIssues();


	/* =====================================================
	   INITIAL CONSOLE MESSAGE
	===================================================== */

	console.log(
		"CivicBuzz Track Issues loaded successfully."
	);

});