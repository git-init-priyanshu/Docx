import React from 'react';
import { Resend } from "resend";

export const SendMail = async (
  to: string,
  subject: string,
  Template: React.ReactNode,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { data, error } = await resend.emails.send({
      from: 'send@pbcreates.xyz',
      to,
      subject,
      react: Template
    });

    if (error) return {
      success: false,
      error: error.message,
    };

    return { success: true, data }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
