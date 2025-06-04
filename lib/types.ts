export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  //   messages: Message[];
  sharePath?: string;
  [key: string]: string | Date | undefined; // Index signature for additional string properties
}

export type initialMessage = {
  DateTime: string;
  Session_id: string;
  answer: string;
  answer_replied_on: string;
  chatter_id: string;
  created_by: string;
  feedback_comments: string;
  feedback_status: string;
  lugpa: null;
  practice_setting: null;
  question: string;
  question_asked_on: string;
  source_file: [];
  source_file_count: null;
  speciality: null;
  study_type: null;
};

export type SideBarChat = {
  DateTime: string;
  Session_id: string;
  created_on: string;
  header_name: string;
  user_id: string;
};
export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
    emailVerified?: Date;
    name?: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}

// Replace Record<string, any> with a proper type definition
export interface User {
  id: string;
  email: string;
  password: string;
  salt: string;
  emailVerified?: Date;
  name?: string;
}
