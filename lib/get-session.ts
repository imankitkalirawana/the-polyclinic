import { cache } from 'react';

import { getServerSession } from '@/lib/serverAuth';

export default cache(getServerSession);
