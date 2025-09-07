import { Icon } from '@iconify/react/dist/iconify.js';

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            The foundation for creative teams management
          </h2>
          <p>
            Lyra is evolving to be more than just the models. It supports an entire to the APIs and
            platforms helping developers and businesses innovate.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y divide-divider border border-divider *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:zap" className="size-4" />
              <h3 className="text-sm font-medium">Faaast</h3>
            </div>
            <p className="text-sm">Quick patient registration, billing, and reporting.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:cpu" className="size-4" />
              <h3 className="text-sm font-medium">Powerful</h3>
            </div>
            <p className="text-sm">Manage patients, staff, and operations with ease.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:shield" className="size-4" />

              <h3 className="text-sm font-medium">Security</h3>
            </div>
            <p className="text-sm">Enterprise-grade protection for patient data.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:pen" className="size-4" />

              <h3 className="text-sm font-medium">Customization</h3>
            </div>
            <p className="text-sm">Tailor workflows to fit your hospital&apos;s needs.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:settings-2" className="size-4" />

              <h3 className="text-sm font-medium">Control</h3>
            </div>
            <p className="text-sm">Real-time insights and full administrative access.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:sparkles" className="size-4" />

              <h3 className="text-sm font-medium">AI Ready</h3>
            </div>
            <p className="text-sm">Smarter scheduling and predictive reporting.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
