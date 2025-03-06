import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

// Расширяем тип User для включения поля role
declare module "next-auth" {
  interface User {
    role?: string;
  }
  
  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// Хардкодированные учетные данные для демонстрации
// В реальном приложении это следует хранить в базе данных
const ADMIN_EMAIL = 'admin@altailand.ru';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Лучше установить через переменные окружения

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Проверка против хардкодированных учетных данных
        // В будущем это должно быть заменено на проверку пользователя из базы данных
        if (credentials.email === ADMIN_EMAIL) {
          // В реальном приложении пароль должен храниться в хешированном виде
          // const passwordMatches = await bcrypt.compare(credentials.password, hashedPassword);
          
          if (credentials.password === ADMIN_PASSWORD) {
            return {
              id: '1',
              email: ADMIN_EMAIL,
              name: 'Администратор',
              role: 'admin'
            };
          }
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/auth/login',
    error: '/admin/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'supersecretkey',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 