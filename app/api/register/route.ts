import Drizzle from '@/lib/drizzle';
import { Events, Users } from '@/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { generateUUID, getNewEventTemplate, getNewUserTemplate } from '@/lib/events';
import { generateEventId } from '@/lib/generate_id';

export async function POST(req: NextRequest) {

  const body = await req.json()
  const drizzle = await Drizzle.getInstance();

  const { name, email, username, password, birthday, timezone, ...rest } = body

  const [theUser] = await drizzle.db.select().from(Users).where(
    or(
      eq(Users.name, name),
      eq(Users.username, username),
      eq(Users.username, email),
      eq(Users.email, email),
    )
  ).limit(1)

  if (theUser) {

    return NextResponse.json(
      {
        error: 'An unknown error.',
        message: "An account with this name or email already exists."
      },
      { status: 400 }
    );
  }


  try {

    const Salt = await bcrypt.genSalt(12)

    console.log({ Salt, password })
    const Passkey = await bcrypt.hash(password, Salt)

    console.log(Salt, Passkey)

    const newUser = {
      ...getNewUserTemplate(),
      id: generateUUID(),
      email,
      username: username ?? email,
      passkey: Passkey,
      home_timezone: timezone,
      birthday: birthday ? new Date(birthday) : null,
      name
    };

    // New birthday
    if (newUser.birthday) {
      const initialEventRow = getNewEventTemplate();
      const eventRow = {
        ...initialEventRow,
        name: `${name}'s Birthday`,
        type: 'all_day',

        start: newUser.birthday,
        start_timezone: timezone,

        end: newUser.birthday,
        end_timezone: timezone,

        created_at: new Date(),
        created_by: 'registration_sequence',

        last_updated_at: new Date(),
        last_updated_with: 'api',

        version: 0,
      }

      eventRow['id'] = generateEventId(eventRow)

      const inserted = await drizzle.db.insert(Events)
      // @ts-ignore
        .values(eventRow)
        .returning()
    }

    // New user
    const createNewUser = await drizzle.db.insert(Users).values(newUser)

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      'report': {
        newUser: createNewUser
      }
    });

  }
  catch (err) {
    
    console.error(err)
    return NextResponse.json(
      { error: 'An unknown error.' },
      { status: 400 }
    );
  }

}