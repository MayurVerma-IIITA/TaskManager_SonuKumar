import prisma from "../lib/prisma.js";

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, stage } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        stage: stage || "TODO",
        userId: req.user.id
      }
    });

    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, stage } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description || null;
    if (stage !== undefined) data.stage = stage;

    const task = await prisma.task.update({
      where: { id },
      data
    });

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      select: { id: true }
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
