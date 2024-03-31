import dynamic from 'next/dynamic';

import { DocsCard, HelloNearCard } from '@/components/cards';
import { NetworkId, ComponentMap } from '@/config';

const Component = dynamic(() => import('@/components/vm-component'), { ssr: false });

const socialComponents = ComponentMap[NetworkId];

export default function HelloComponents() {

  return (
    <>
      <main >
        <div >
          <p>
            Loading components from: &nbsp;
            <code >{socialComponents.socialDB}</code>
          </p>
        </div>
        <div >
          <h1> <code>Multi-chain</code> Components Made Simple </h1>
        </div>
        <div className='row'>
          <div class="col-6">
            <Component src={socialComponents.HelloNear} />
            <p class="my-4">&nbsp;</p>
            <Component src={socialComponents.LoveNear} />
          </div>
          <div class="col-6">
            <Component src={socialComponents.Lido} />
          </div>
        </div>
        <hr />

        <div >
          <DocsCard />
          <HelloNearCard />
        </div>
      </main>
    </>
  );
}