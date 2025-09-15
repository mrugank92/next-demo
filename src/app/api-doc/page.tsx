import { getApiDocs } from '@/libs/swagger';
import ReactSwagger from './ReactSwagger';
import type { SwaggerSpec } from '@/types/swagger';

export default async function page() {
    const spec: SwaggerSpec = await getApiDocs();
    return (
        <section className=''>
            <ReactSwagger spec={spec} />
        </section>
    )
}
