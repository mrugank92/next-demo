'use client';

import 'swagger-ui-react/swagger-ui.css'
import dynamic from 'next/dynamic';
import type { SwaggerSpec } from '@/types/swagger';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

type Props = {
    spec: SwaggerSpec,
}

function ReactSwagger({ spec }: Props) {
    return (
        <div>
            <SwaggerUI spec={spec} />
        </div>
    )
}

export default ReactSwagger