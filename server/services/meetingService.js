/**
 * Meeting Service - Handles all meeting-related database operations
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @param {number} projectId - Project ID to include in slug
 * @returns {string} Generated slug
 */
function generateSlug(text, projectId) {
	const baseSlug = text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
	
	const timestamp = Date.now();
	return `${projectId}-${baseSlug || 'meeting'}-${timestamp}`;
}

/**
 * List all meetings with optional filters
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Object} filters - Filter options (projectId, creator)
 * @returns {Promise<Object>} Array of meetings
 */
export async function listMeetings(prisma, filters = {}) {
	try {
		const where = {};
		
		if (filters.projectId !== undefined) {
			where.projectId = parseInt(filters.projectId);
		}
		
		if (filters.creator !== undefined) {
			where.creator = parseInt(filters.creator);
		}
		
		const meetings = await prisma.meeting.findMany({
			where,
			orderBy: { date: 'desc' },
		});
		
		return { success: true, data: meetings };
	} catch (error) {
		console.error('Error listing meetings:', error);
		return { success: false, error: error.message };
	}
}

/**
 * Get a single meeting by ID
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {number} id - Meeting ID
 * @returns {Promise<Object>} Meeting object
 */
export async function getMeetingById(prisma, id) {
	try {
		const meetingId = parseInt(id);
		if (isNaN(meetingId)) {
			return { success: false, error: 'Invalid meeting ID', statusCode: 400 };
		}

		const meeting = await prisma.meeting.findUnique({
			where: { id: meetingId },
		});

		if (!meeting) {
			return { success: false, error: 'Meeting not found', statusCode: 404 };
		}

		return { success: true, data: meeting };
	} catch (error) {
		console.error('Error getting meeting:', error);
		return { success: false, error: error.message };
	}
}

/**
 * Get a single meeting by slug
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {string} slug - Meeting slug
 * @returns {Promise<Object>} Meeting object
 */
export async function getMeetingBySlug(prisma, slug) {
	try {
		const meeting = await prisma.meeting.findUnique({
			where: { slug },
		});

		if (!meeting) {
			return { success: false, error: 'Meeting not found', statusCode: 404 };
		}

		return { success: true, data: meeting };
	} catch (error) {
		console.error('Error getting meeting by slug:', error);
		return { success: false, error: error.message };
	}
}

/**
 * Create a new meeting
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Object} meetingData - Meeting data
 * @returns {Promise<Object>} Created meeting object
 */
export async function createMeeting(prisma, meetingData) {
	try {
		const {
			projectId,
			title,
			date,
			description,
			creator,
			slug,
		} = meetingData;

		// Validation
		if (!projectId) {
			return { 
				success: false, 
				error: 'Project ID is required',
				statusCode: 400 
			};
		}

		if (!title) {
			return { 
				success: false, 
				error: 'Title is required',
				statusCode: 400 
			};
		}

		if (!date) {
			return { 
				success: false, 
				error: 'Date is required',
				statusCode: 400 
			};
		}

		if (!creator) {
			return { 
				success: false, 
				error: 'Creator is required',
				statusCode: 400 
			};
		}

		// Verify project exists
		const project = await prisma.project.findUnique({
			where: { id: projectId },
		});

		if (!project) {
			return { 
				success: false, 
				error: 'Project not found',
				statusCode: 404 
			};
		}

		// Verify creator (user) exists
		const user = await prisma.user.findUnique({
			where: { id: creator },
		});

		if (!user) {
			return { 
				success: false, 
				error: 'Creator user not found',
				statusCode: 404 
			};
		}

		// Generate slug if not provided
		let finalSlug = slug;
		if (!finalSlug) {
			finalSlug = generateSlug(title || project.title || 'meeting', projectId);
		}

		// Check if slug already exists
		const existingMeeting = await prisma.meeting.findUnique({
			where: { slug: finalSlug },
		});

		if (existingMeeting) {
			// If slug exists, append timestamp to make it unique
			finalSlug = `${finalSlug}-${Date.now()}`;
		}

		const meeting = await prisma.meeting.create({
			data: {
				projectId,
				title,
				date: new Date(date),
				description: description || null,
				creator,
				slug: finalSlug,
				createdAt: new Date(),
			},
		});

		return { success: true, data: meeting, statusCode: 201 };
	} catch (error) {
		console.error('Error creating meeting:', error);
		
		if (error.code === 'P2002') {
			return { 
				success: false, 
				error: 'Meeting with this slug already exists',
				statusCode: 409 
			};
		}

		return { success: false, error: error.message };
	}
}

/**
 * Update an existing meeting
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {number} id - Meeting ID
 * @param {Object} meetingData - Meeting data to update
 * @returns {Promise<Object>} Updated meeting object
 */
export async function updateMeeting(prisma, id, meetingData) {
	try {
		const meetingId = parseInt(id);
		if (isNaN(meetingId)) {
			return { success: false, error: 'Invalid meeting ID', statusCode: 400 };
		}

		// Check if meeting exists
		const existingMeeting = await prisma.meeting.findUnique({
			where: { id: meetingId },
		});

		if (!existingMeeting) {
			return { success: false, error: 'Meeting not found', statusCode: 404 };
		}

		// Prepare update data
		const updateData = {
			updatedAt: new Date(),
		};

		if (meetingData.projectId !== undefined) {
			updateData.projectId = parseInt(meetingData.projectId);
		}

		if (meetingData.title !== undefined) {
			updateData.title = meetingData.title;
		}

		if (meetingData.date !== undefined) {
			updateData.date = new Date(meetingData.date);
		}

		if (meetingData.description !== undefined) {
			updateData.description = meetingData.description || null;
		}

		if (meetingData.slug !== undefined) {
			updateData.slug = meetingData.slug;
		}

		// Verify project exists if projectId is being updated
		if (updateData.projectId !== undefined) {
			const project = await prisma.project.findUnique({
				where: { id: updateData.projectId },
			});

			if (!project) {
				return { 
					success: false, 
					error: 'Project not found',
					statusCode: 404 
				};
			}
		}

		const meeting = await prisma.meeting.update({
			where: { id: meetingId },
			data: updateData,
		});

		return { success: true, data: meeting };
	} catch (error) {
		console.error('Error updating meeting:', error);

		if (error.code === 'P2025') {
			return { 
				success: false, 
				error: 'Meeting not found',
				statusCode: 404 
			};
		}

		if (error.code === 'P2002') {
			return { 
				success: false, 
				error: 'Meeting with this slug already exists',
				statusCode: 409 
			};
		}

		return { success: false, error: error.message };
	}
}

/**
 * Delete a meeting
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {number} id - Meeting ID
 * @returns {Promise<Object>} Success status
 */
export async function deleteMeeting(prisma, id) {
	try {
		const meetingId = parseInt(id);
		if (isNaN(meetingId)) {
			return { success: false, error: 'Invalid meeting ID', statusCode: 400 };
		}

		// Check if meeting exists
		const existingMeeting = await prisma.meeting.findUnique({
			where: { id: meetingId },
		});

		if (!existingMeeting) {
			return { success: false, error: 'Meeting not found', statusCode: 404 };
		}

		await prisma.meeting.delete({
			where: { id: meetingId },
		});

		return { success: true, message: 'Meeting deleted successfully' };
	} catch (error) {
		console.error('Error deleting meeting:', error);

		if (error.code === 'P2025') {
			return { 
				success: false, 
				error: 'Meeting not found',
				statusCode: 404 
			};
		}

		return { success: false, error: error.message };
	}
}
