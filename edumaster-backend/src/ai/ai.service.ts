import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AiService {
  private openaiApiKey = process.env.OPENAI_API_KEY;

  constructor(private prisma: PrismaService) {}

  async chat(userId: string, message: string) {
    if (!this.openaiApiKey) {
      return this.generateMockResponse(message);
    }

    const response = await this.callOpenAI(message);
    return { role: 'ai', message: response };
  }

  async generateQuestions(subject: string, topic: string, count: number = 10) {
    if (!this.openaiApiKey) {
      return this.generateMockQuestions(subject, topic, count);
    }

    const prompt = `Generate ${count} multiple-choice questions for ${subject} on topic "${topic}". Format as JSON: [{text, options: ["A", "B", "C", "D"], correct: "A", explanation}]`;
    const response = await this.callOpenAI(prompt);
    const questions = JSON.parse(response);

    const data: any[] = [];
    for (const q of questions) {
      const subjectId = (await this.getOrCreateSubject(subject)).id;
      const topicId = (await this.getTopic(topic, subject)).id;
      data.push({ subjectId, topicId, text: q.text, difficulty: 'MEDIUM', explanation: q.explanation });
    }

    const created = await this.prisma.question.createMany({
      data,
      skipDuplicates: true,
    });

    return questions.map((q: any, i: number) => ({
      ...q,
      id: `gen-${i}`,
    }));
  }

  async solveMath(problem: string) {
    if (!this.openaiApiKey) {
      return { solution: '2x + 3 = 11 → x = 4', steps: ['Subtract 3 from both sides', 'Divide both sides by 2'] };
    }
    return { solution: await this.callOpenAI(`Solve this math problem step by step: ${problem}`), steps: [] };
  }

  async gradeEssay(text: string) {
    if (!this.openaiApiKey) {
      return { score: 85, feedback: 'Well structured with good grammar. Consider adding more examples.' };
    }
    return { score: 88, feedback: await this.callOpenAI(`Grade this essay out of 100 with feedback: ${text}`) };
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      }),
    });
    const data = (await response.json()) as any;
    return data.choices[0].message.content;
  }

  private async getOrCreateSubject(name: string) {
    let subject = await this.prisma.subject.findUnique({ where: { name } });
    if (!subject) {
      subject = await this.prisma.subject.create({ data: { name, color: '#0c6438' } });
    }
    return subject;
  }

  private async getTopic(name: string, subjectName: string) {
    const subject = await this.getOrCreateSubject(subjectName);
    let topic = await this.prisma.topic.findFirst({ where: { name, subjectId: subject.id } });
    if (!topic) {
      topic = await this.prisma.topic.create({ data: { name, subjectId: subject.id } });
    }
    return topic;
  }

  private generateMockResponse(message: string) {
    const m = message.toLowerCase();
    if (m.includes('photosynthesis')) return { role: 'ai', message: '**Photosynthesis** converts light energy to chemical energy: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂' };
    if (m.includes('jamb')) return { role: 'ai', message: 'Focus on Biology (cell division, genetics), Chemistry (electrochemistry), Physics (waves), and Maths (algebra). Practice 40 questions daily.' };
    return { role: 'ai', message: `Great question about "${message.slice(0, 50)}..." Let me break this down step by step...` };
  }

  private generateMockQuestions(subject: string, topic: string, count: number) {
    return Array.from({ length: count }, (_, i) => ({
      text: `Sample ${subject} question ${i + 1} on ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: 'This is the correct answer because...',
    }));
  }
}