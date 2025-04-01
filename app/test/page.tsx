import { auth } from "@/auth";

const Test = async () => {
	const session = await auth();
	console.log(session);
	return <div>Test</div>;
};

export default Test;
